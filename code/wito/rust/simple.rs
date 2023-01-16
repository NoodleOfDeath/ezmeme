fn main() {
  let world = "Rustland";
  println!("I'm a {title}!",
           title="Rustacean");
  // @cometechthis
  println!("I hail from {}!",
           world);
  println!("I'm a {1} from {0}!",
           world,
           "Rustacean");
}