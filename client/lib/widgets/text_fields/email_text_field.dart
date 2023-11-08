import 'package:flutter/material.dart';

class EmailField extends StatelessWidget {
  const EmailField({super.key, required this.emailController});
  final TextEditingController emailController;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          controller: emailController,
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: Color.fromARGB(255, 225, 225, 225),
            labelText: 'Email',
            hintStyle: TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
            hintText: 'Enter your email address',
          ),
        ),
      ],
    );
  }
}
