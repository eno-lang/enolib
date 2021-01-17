fn main() {
    let input = String::from(">language: eno");

    let document = enolib::parse(&input, false);

    document.unwrap().parent();
}
