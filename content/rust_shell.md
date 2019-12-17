+++
title = "rust shell"
date = 2019-12-17

[taxonomies] 
categories = ["rust"] 
tags = ["rust"]
+++

First create a new rust binary

```
$ cargo new rust_shell --bin
     Created binary (application) `rust_shell` package
$ cd rust_shell
```

Next add `termion` as a dependency in `Cargo.toml`:

```toml
[dependencies]
termion = "1.5.4"
```

We are going to need to handle individual character input, backspaces and new lines as well as `Ctrl-c` to quit.  So, let's scaffold out a main program that prints to `stdout` whenever it receives one of these inputs.

```rust
use std::io::stdin;
use termion::event::Key;
use termion::input::TermRead;
use termion::raw::IntoRawMode;
use std::io::{Write, stdout};

fn main() {
    let stdin = stdin();
    let mut stdout = stdout().into_raw_mode().unwrap();
    for c in stdin.keys() {
        match c.unwrap() {
            Key::Char('\n') => {
                writeln!(stdout, "New line entered\r").unwrap();
                stdout.flush().unwrap();
            },
            Key::Char(c)    => {
                writeln!(stdout, "char {} entered\r", c).unwrap();
                stdout.flush().unwrap();
            },
            Key::Backspace => {
                writeln!(stdout, "backspace entered\r").unwrap();
                stdout.flush().unwrap();
            },
            Key::Ctrl('c')  => break,
            _               => (),
        }
    }
}
```

This will give us output like this every time we hit a relevant key

```
$ cargo run
char f entered
char o entered
char b entered
backspace entered
char o entered
New line entered
```

Next, let's refactor this to provide some encapsulation.  We'll build a type that contains functions to handle each type of input.

```rust
use termion::raw::IntoRawMode;
use std::io::{Stdout, Write, stdout};

pub struct Shell {
    stdout: termion::raw::RawTerminal<Stdout>
}

impl Shell {
    pub fn new() -> Self {
        let stdout = stdout().into_raw_mode().unwrap();
        Shell {
            stdout: termion::raw::RawTerminal::from(stdout)
        }
    }

    pub fn handle_char(&mut self, c: char) {
        writeln!(self.stdout, "char {} entered\r", c).unwrap();
        self.stdout.flush().unwrap();
    }

    pub fn handle_newline(&mut self) {
        writeln!(self.stdout, "New line entered\r").unwrap();
        self.stdout.flush().unwrap();
    }

    pub fn handle_backspace(&mut self) {
        writeln!(self.stdout, "backspace entered\r").unwrap();
        self.stdout.flush().unwrap();
    }
}
```