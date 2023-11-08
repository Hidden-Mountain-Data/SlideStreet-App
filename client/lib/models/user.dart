class User {
  final int id;
  final String email;
  final String firstName;
  final String lastName;

  const User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['data']['user_id'],
      email: json['data']['email'],
      firstName: json['data']['first_name'],
      lastName: json['data']['last_name'],
    );
  }
}
