---
title: 'Understanding polymorphism'
date: '2020-05-26'
---

I have been working on a programming language for quite some time now. And I realized I didn't understand well polymorphism. So in order to fix this I wrote this post.

<!-- more -->

First of all, oh boy there are a lot of ways to do polymorphism. It took me two months and more to finish writing this article. And still doesn't feel as polished as I would like. One part being that the subject is a bit nebulous (specially parametric polymorphism). The other being it's the first article I write. So it's far from being perfect and if I said something wrong I apologize.

As I said before, there are a lot of ways to do polymorphism, I only show some on this post. Still, there are a lot of details left behind in favor of being concise.

## Generic

Some times you want to generalize functions or data types.

### Generic functions

Suppose you have the following code in C:

```c
int square_int(int n) {
	return n * n
}

float square_float(float n) {
	return n * n
}

double square_double(double n) {
	return n * n
}
```

Each function does the same, but operate over different types. Wouldn't be better if you could just write a function that squares `int`'s, `float`s and `double`'s?

That's what generic functions are for. The idea is that sometimes a behavior (function) can be used over different types.

#### Templates/Generics

One way to have generic functions is by using templates and/or generics. In C++  you have templates. In Java you have generics. They allow to parametrize the types a function can receive. So when calling a function, in addition to the arguments, you have to specify over what types you are calling the function.

In C++ the `square` function look like this:

```cpp
template <class T> // Create a template parameter named T
T square(T n) {    // Defines a function named square that receives T and returns T
	return n * n;
}

int main() {
	int a = square<int>(4);
	float b = square<float>(4);
	double c = square<double>(4);
	return 0;
}
```

You can see that you define square just one time, and then you can use it with different types as longs they support multiplication.

#### Duck typing

Another way to achieve parametric polymorphism is duck typing. When using duck typing you don't specify any types for the arguments of the function. The language determines which types work and which doesn't base on the operations and functions applied to them.

In Python, a language that uses duck typing, our `square` function would look like this:

```python
def square(n):      # Defines a function named square that takes one parameter
	return n * n

print(square(4))    # 16
print(square(4.0))  # 16.0
```

Similar to in C++ you can use the `square` function with different types as long they support multiplication.

Even though most programming languages that allow duck typing are dynamic, it can also be found in statically typed languages. The same example on Haskell would look like this:

```haskell
square n = n * n

main = do
  print(square(4))    -- 16
  print(square(4.0))  -- 16.0
```

As in Python and C++, you can use the square function with different types as longs they support multiplication. In a lot of ways, duck typing it's like templates, just more implicit.

#### Parametric polymorphism

This one it's interesting, because it allows parametricity. I could try to write about it, but I would take just too much more effort. And also there are already a lot of better resources than I could ever make:

- <a href="https://bartoszmilewski.com/2014/09/22/parametricity-money-for-nothing-and-theorems-for-free/"  target="_blank">Parametricity: Money for Nothing and Theorems for Free by Bartosz Milewski</a>
- <a href="https://youtu.be/ngswgTy7Ao8" target="_blank">Parametricity, Functional Programming, Types by Tony Morris at #FnConf18</a>

### Generic types

When you are defining a collection, most of the time you want it to work with different types. Imagine you are implementing a linked list in C.

If you are not familiar with linked lists they are just a way to represent lists on memory. The problem is that without generics you have to define the linked list multiple times. Basically one for every type you want to be able to make lists off.

Though If we had parametric types we could define the linked list once. Lucky for us there are languages that support parametric types. A linked list In C++ could look something like this:

```cpp
template <typename T>
struct LinkedList {
  T current;
  LinkedList* next;
};

LinkedList<float> list; // And now you have a linked list of float
```

Essentially, parametric types are templates applied to types. Most times you are working with collections you want them to be generic.

## Ad hoc

Ad hoc polymorphism consists of having different versions of a function, for different types. There are three ways you can have this type of polymorphism, and they all are more or less the same.

### Operator Overloading

If you are reading this probably you know that not all numbers are represented equally. On a computer, integers are represented differently than floating numbers. So integers can't be added the same way floating numbers are added.

However, most languages use the same operator to add them. That's operator overloading.

```c
a = 3 + 2
b = 3.0 + 2.0
c = "Hello, " + "World!" // Concatenate
```

Operator overloading consists of having multiple definitions of an operator for different types. What definition is used depends on the types is called with.

### Function Overloading

Function overloading works in a similar way to operator overloading. If you consider operators syntactic sugar for functions, then they are similar.

Function overloading consists of having multiple definitions of a function. What version to call is decided depending on the types of the arguments.

Let's look at a C++ example.

```cpp
#include <iostream>

struct Point2 {
	float x;
    float y;
};

struct Point3 {
    float x;
    float y;
    float z;
};

void print_point(Point2 p) {
    std::cout << "(" << p.x << ", " << p.y << ")" << std::endl;
}

void print_point(Point3 p) {
    std::cout << "(" << p.x << ", " << p.y << ", " << p.z << ")" << std::endl;
}

int main() {
    Point2 p1 = Point2{.x = 2.0, .y = 3.5};
    Point2 p2 = Point2{.x = 0.5, .y = 4.1, .z = 1.0};
    print_point(p1);
    print_point(p2);
    return 0;
}
```

Then when running the program the output is:

```
(2.0, 3.5)
(0.5, 4.1, 1.0)
```

The point of the example it's that even if we call `print_point` over `p1` and `p2`, actually two different functions end up being called. That's because `p1` and `p2` have different type.

### Multiple Dispatch

It's almost the same as function overloading with one key difference. What function to call is decided at runtime.

Let's our example of function overloading in Julia, a language with multiple dispatch.

```julia
struct Point2
	x::Float32
	y::Float32
end

struct Point3
	x::Float32
	y::Float32
	z::Float32
end

function print_point(p::Point2)
	println("($(p.x), $(p.y))")
end

function print_point(p::Point3)
	println("($(p.x), $(p.y), $(p.z))")
end

point = if rand() > 0.5  # The rand() function return a random
		Point2(2.0, 3.5) # number between 0 and 1
	else
		Point3(0.5, 4.1, 1.0)
	end

print_point(point) # Can print (2.0, 3.5) or (0.5, 4.1, 1.0) depending on
                   # the result of rand()
```

As you can see  the value of `rand()` can't be known at compile-time, therefore the type of `point` also can't be known.  Then what version of `print_point ` to call must be decided at runtime.

---
**Note:**

You may have listen about single dispatch? Well, it's the same as multiple dispatch, just that what function to call is decided based on just one of the parameters. This parameter usually being the object on what a method (the function) is called.

---


## Other stuff

Things in this category can't be classified exactly as parametric or ad hoc. They can allow both types and sometimes, even a little more.

### Type Classes

A type class consists of a set of functions that should be implemented for a type.

Let's see an example. (In Haskell of course)

```haskell
-- Define the Shape class
class Shape a where
    surface :: a -> Float
    perimeter :: a -> Float

-- Define two records (or structs)
data Circle = Circle Float
data Rectangle = Rectangle Float Float

-- Implements Shape class for Circle
instance Shape Circle where
    surface (Circle r)   = pi * r^2
    perimeter (Circle r) = 2 * pi * r

-- Implements Shape class for Rectangle
instance Shape Rectangle where
    surface (Rectangle w h)   = w * h
    perimeter (Rectangle w h) =  2 * (w + h)

-- Implements a generic function for Shape
print_surface :: (Shape a) => a -> IO()
print_surface a = print (surface a)

main = do
    print_surface (Circle 15)
    print_surface (Rectangle 20 40)

```

The output of the program is:

```
706.85834
800
```

In the example first, we define a type class named `Shape` with two functions. Then define two records `Circle` and `Rectangle`. Make `Circle` and `Rectangle` part of the type class `Shape` by implementing the class functions.  And finally, we define a generic function that prints the surface of a `Shape`.

There where two types of polymorphism involved here. First, we use ad hoc polymorphism when defining the `surface` and `perimeter` for different types. And then parametric bounded polymorphism when defining the `print_surface` for a type that implements `Shape` type class.

One important thing to know it's that type classes define constraints, not types. So you can't have a variable of type `Shape`, nor have collections that contains `Shape`. And that leads to subtyping...

### Subtyping

For a language to allow subtyping it should exist a hierarchical relation between its types. And it should allow using a subtype from a type anywhere that type it's expected.

This can be achieved  in a lot of different ways. For example with inheritance, interfaces, traits and/or abstract types. This are the ones I know off, but probably there are more.

Let's see an example in Julia. (Julia uses abstract types)

```julia
abstract type Shape end
print_surface(s::Shape) = println(surface(s))

struct Circle <: Shape
  radius
end
surface(c::Circle) = pi * c.radius^2

struct Rectangle <: Shape
  width
  height
end

surface(r::Rectangle) = r.width * r.height

print_surface(Circle(15))
print_surface(Rectangle(20, 40))
```

In Julia subtyping is achieved trough abstract types. As you can see they can be used in a way very similar to type classes.

But subtyping doesn't stop there, there are some things that you can't do with type classes.  With subtyping, you can have a variable of type `Shape` or a collection with elements of different type.

Of course, this adds some complexity known as variance, but that's goes beyond the scope of this post.

## Closing thoughts

The content of the article can be summarized more or less like this:

- Generic
  - Same interface, same behavior.
  - Parametric polymorphism
    - Parametricity
- Ad hoc
  - Same interface, different behavior.
- Type classes
  - Bounded parametric functions.
  - Ad hoc
- Subtyping
  - Bounded parametric functions.
  - Ad hoc
  - Same variable can be of different types.

Still there is a lot of things you can talk about when talking about polymorphism. This is just the tip of the iceberg. Also I have the impression every language seems to offer its own variation of these techniques. Even if languages have features that on surface seem similar, often the guarantees they provide are different.

Also I didn't talk about implementation. Nor what techniques I found more interesting for a language. These things could be worth looking more into it.
