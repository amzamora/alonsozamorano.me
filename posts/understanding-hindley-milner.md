---
title: 'Understanding Hindley–Milner'
date: '2025-06-06'
---

<u>Disclaimer:</u> Before starting, be warned this post is inspired by the video series [Type Systems: Lambda calculus to Hindley-Milner](https://youtu.be/b5VhYkvOk30?list=PLoyEIY-nZq_uipRkxG79uzAgfqDuHzot-) by Adam Jones. I strongly recommend you watch this if you, like me, has been struggling to get into Hindley-Milner, and type theory in general.

<!-- more -->

Hindley-Milner is a type system for the lambda calculus. A type system is a set of rules for assigning types to expressions. They can verify that annotated types are correct, or infer the types. On the other hand, lambda calculus is a mathematical system created to reason about computation. Is like a really really small programming language.

The type system was originally described by J. Roger Hindley in [1969](https://www.cs.tufts.edu/~nr/cs257/archive/roger-hindley/principal-type-scheme.pdf) for combinatory logic. Then, rediscovered by Robin Milner in [1978](https://homepages.inf.ed.ac.uk/wadler/papers/papers-we-love/milner-type-polymorphism.pdf) for the ML programming language. Finally, Damas formalized the type system for lambda calculus in [1984](https://era.ed.ac.uk/bitstream/handle/1842/13555/Damas1984.Pdf?sequence=1&isAllowed=y).

The core value of Handley-Milner is to support generic programming while mostly not needing type annotations. With the Hindley-Milner system, the most general type for an expression can be inferred.

Most popular languages that use variations of this system include [Haskell](https://www.haskell.org/), [OCaml](https://ocaml.org/), [Rust](https://www.rust-lang.org/), [Swift](https://www.swift.org/),  [Elm](https://elm-lang.org/) and [Gleam](https://gleam.run/).

## How this looks in practice?

The easiest way to implement a type system is to require type annotations, and then verify that incosistencies don't exist. The other easiest way to implement a type system it's to make the language sytanx directed. Meaning and integer literal always going to be an integer, unless stated otherwise. 

This requires less type annotations, but some expressions will still need them to disambiguate. For example:

```python
list = []
list.append(1)
list.append(2)
list.append(3)
```

Here, `list` needs a type annotation to know what type of list it is even though clearly its a list of integers. 

In a Hindley-Milner type system, annotating the type of the list wouldn't be necessary. The type of list would be inferred based on how it is used. We can see that integers are appended after the declaration, so the list must be a list of integers.

This makes easy to write generic code and code that's easy to change, while maintaining static type safety. If you want to be explicit, you can always add type annotations later.

## Formalization

Hindley-Milner consists of a set of rules about types in lambda calculus. Then, an algorithm can make use of these rules to infer types. That's the case for **algorithm W** and **algorithm M**.

### Lambda calculus with let polymorphism (The language)

Its syntax can be described as:

$$
\begin{align*}
e =& \ \htmlStyle{color: var(--magenta)}{x} \newline
  |& \ \htmlStyle{color: var(--cyan);}{e_1 \ e_2} \newline
  |& \ \htmlStyle{color: var(--yellow);}{\lambda x \rightarrow e} \newline
  |& \ \htmlStyle{color: var(--lime);}{let \ x = e_1 \ in \ e_2}
\end{align*}
$$

An expression can be a <span style="color: var(--magenta)">variable/constant</span>,  an <span style="color: var(--cyan)">application</span>, an <span style="color: var(--yellow)">anonymous function</span> or a <span style="color: var(--lime)">let expression</span>. Some examples of expressions could be:

- $\htmlStyle{color: var(--cyan);}{odd \ 3}$
- $\htmlStyle{color: var(--yellow);}{\lambda x \rightarrow odd \ x}$
- $\htmlStyle{color: var(--cyan);}{(\lambda x \rightarrow x) \ 3}$
- $\htmlStyle{color: var(--lime);}{let \ identity = \lambda x \rightarrow x \ in \ identity \ 10}$

An <span style="color: var(--cyan)">application</span> is just a <span style="color: var(--cyan)">function call</span>.

On the other hand, the equivalent of a <span style="color: var(--lime)">let expression</span> in a modern programming language would be a <span style="color: var(--lime)">function binding</span>. This is what allows generic functions in a static type system.

$$
\begin{align*}
(\lambda \ id \rightarrow id \ (odd \ (id \ 3))) (\lambda \ id \rightarrow id)
\end{align*}
$$

The above expression would work well in an untyped programming language. But even if it makes sense, we could not infer the types correctly in a static type system for the previous expression. For this we must use a <span style="color: var(--lime)">let expression</span>.

$$
\begin{align*}
let \ id = \lambda \ id \rightarrow id \ in \ id \ (odd \ (id \ 3))
\end{align*}
$$

If we try to infer types for the function application, we first would find that the first argument of the identity function is an *integer*, and then a *boolean*, this would be a type error. On the other hand, with <span style="color: var(--lime)">let expression</span>, we found first that type of $id$ is $\forall t. \ \ t \rightarrow t$. This means we can instantiate $id$ separately in both function applications.

#### Types

$$
\begin{align*}
\tau =& \ \htmlStyle{color: var(--magenta)}{\alpha} \newline
     |& \ \htmlStyle{color: var(--cyan);}{ C \ \tau_1 ... \tau_n}
\end{align*}
$$

A type can be a <span style="color: var(--magenta)">type variable</span> or a <span style="color: var(--cyan)">type function application</span>. 

<span style="color: var(--cyan)">C</span> would be a constant type, like $Int$, $Bool$, $List$, $\rightarrow$, etc. It can have any number of parameters.

#### Type schemes

$$
\begin{align*}
\sigma =& \ \htmlStyle{color: var(--magenta)}{\tau} \newline
     |& \ \htmlStyle{color: var(--cyan);}{ \forall \ \alpha . \ \sigma}
\end{align*}
$$

A type scheme may consist of a  <span style="color: var(--magenta)">type</span>, or  a <span style="color: var(--cyan)">a type quantified with for all</span>. When an expression has a type with type variables, the for all allows you to instantiate the type variables every time the expression is used.

#### Type context

Is where you store what type different variables have. It's a list of variable to type assignments. Is denoted generally with $\Gamma$.

### Typing rules (The type system)

A typing rule consists of a premise and a conclusion. If the premise is true, then its conclusion also must be true. They are denoted like:

$$
\begin{align*}
Rule = \frac{Premise}{Conclusion}
\end{align*}
$$

The typing rules for Hindley-Milner are:

$$
\begin{align*}
\frac{x : \sigma \in \Gamma}{\Gamma \vdash x : \sigma}
\end{align*}
$$

<u>Variable typing rule</u>: If assignment $x : \sigma$ is in $\Gamma$ **then** in context $\Gamma$ it follows that $x$ has type $\sigma$.

$$
\begin{align*}
\frac{\Gamma \vdash e_0 : \tau_a \rightarrow \tau_b  \ \ \ \ \ \Gamma \vdash e_1 : \tau_a}{\Gamma \vdash e_0 \ e_1 : \tau_b}
\end{align*}
$$

<u>Function application typing rule:</u> If in context $\Gamma$ it follows that expression $e_0$ has type $\tau_a \rightarrow \tau_b$ and expression $e_1$ has type $\tau_a$. **Then**, in context $\Gamma$ it follows the expression $e_0 \ e_1$ has type $\tau_b$.

$$
\begin{align*}
\frac{\Gamma + x : \tau_a \vdash e : \tau_b}{\Gamma \vdash \lambda x \rightarrow e : \tau_a \rightarrow \tau_b}
\end{align*}
$$

<u>Function abstraction typing rule:</u> If it follows that expression $e$ has type $\tau_b$ in the case we add $x : \tau_a$ to $\Gamma$. **Then**, it follows that in $\Gamma$ the expression $\lambda x \rightarrow e$ has type $\tau_a \rightarrow \tau_b$.

$$
\begin{align*}
\frac{\Gamma \vdash e_0 : \sigma \ \ \ \ \ \Gamma + x:\sigma \vdash e_1 : \tau}{\Gamma \vdash let \ x = e_0 \ in \ e_1 : \tau}
\end{align*}
$$

<u>Let binding rule:</u> If in $\Gamma$ it follows that $e_0$ has type $\sigma$, and it follows that if we add $x : \sigma$ to typing context $e_1$ has type $\tau$. **Then**, it follows that the expression $let \ x = e_0 \ in \ e_1$ has type $\tau$.

### Algorithm W (An inference algorithm)

The following is the first algorithm proposed to infer types in Hindlye-Milner types. It is a recursive algorithm that takes as input a **type context** and an **expression**, and returns a **substitution** and a **type**. The type is what we care about.

$$
\begin{align*}
W(\Gamma, \ x) =& \ (identity,\ instantiate(\Gamma(x))) \newline
W(\Gamma, \ \lambda x \rightarrow e) =& \ let \ (S_1, \tau_b) = W(\Gamma + x: new \ \tau_a, e) \newline
                                      &in \ (S_1, S_1(\tau_a \rightarrow \tau_b)) \newline
W(\Gamma, \ e_1 \ e_2) =& \ let \newline
								&(S_1, \tau_1) = W(\Gamma, e_1) \newline
                                &(S_2, \tau_a) = W(\Gamma, e_2) \newline
                                &S_3 = unify(S_2(\tau_1), \tau_a \rightarrow new \ \tau_b) \newline
                                in \ &(S_3 \ S_2 \ S_1, S_3 \ \tau_b) \newline
W(\Gamma, \ let \ x = e_1 \ in \ e_2) =& \ let \newline
                                     &(S_1, \tau_1) = W(\Gamma, e_1) \newline
                                     &(S_2, \tau_2) = W(S_1\Gamma + x : generalize(S_1\Gamma, \ \tau_1), \ e_2) \newline
                                     &in \ (S_2 \ S_1, \tau_2)
\end{align*}
$$

The function <u>instantiate</u> takes a type scheme, and for each for all creates a new type variable and replaces it in the body of the type. The result is a type without for all quantifiers.

The function <u>unify</u> takes two types and returns a substitution that, when applied to both types, makes them equal.

A <u>substitution</u> is a list of mappings from type variables to other types.

The function <u>generalize</u> adds for all quantifiers to free type variables in a type. i.e. it adds a forall quantifier to all type variables in a type that are not currently quantified.

### Algorithm M (Another inference algorithm)

M is also a recursive algorithm, but it takes as input a **type context**, a **expression**, and a **type**, and returns a **substitution**. If we want to infer the type of an expression $e$, we create a new type variable $\tau$ and call $M(\Gamma, e, \tau)$. Then we apply the resulting substitution to $\tau$ to know the type of $e$.

$$
\begin{align*}
M(\Gamma, \ x, \ \tau) =& \ unify(\tau, \ instantiate(\Gamma(x))) \newline
M(\Gamma, \ \lambda x \rightarrow e, \ \tau) =& \ let \newline
	                                         &S_1 = unify(\tau, \ new \ \tau_a \rightarrow new \ \tau_b) \newline
	                                         &S_2 = M(S_1 \Gamma +x : S_1 \tau_a, \ e, \ S_1 \tau_b) \newline
                                             &in \ S_2 S_1 \newline 
M(\Gamma, \ e_1 \ e_2, \ \tau_b) =& \ let \newline
                                 &S_1 = M(\Gamma, \ e_1, \ new  \ \tau_a \rightarrow \tau_b) \newline
                                 &S_2 = M(S_1 \Gamma, \ e_2, \ S_1\tau_a ) \newline
                                 &in \ S_2 S_1 \newline
M(\Gamma, \ let \ x = e_1 \ in \ e_2, \ \tau) =& \ let \newline
                                               &S_1 = M(\Gamma, \ e_1, \ new  \ \tau_1) \newline
                                               &S_2 = M(S_1 \Gamma + x : generalize(S_1\Gamma, \ S_1 \tau_1), \ e_2, \ S_1 \tau) \newline
                                               &in \ S_2 S_1
\end{align*}
$$

Algorithm M is top-down instead of bottom-up. This means constraints are propagated from the top, and if we detect an error, we first dot it in a leaf.
