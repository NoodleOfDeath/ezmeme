Require Import Coq.Lists.List.
Require Import Io.All.
Require Import Io.System.All.
Require Import ListString.All.

Import ListNotations.
Import C.Notations.

(** @cometechthis *)
Definition hello_world (argv : list LString.t) : C.t System.effect unit :=
System.log (LString.s "Hello world!").