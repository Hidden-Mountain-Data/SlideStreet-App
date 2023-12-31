import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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
          decoration: InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: const Color.fromARGB(255, 225, 225, 225),
            labelText: 'Email',
            hintStyle: GoogleFonts.montserrat(
                color: const Color.fromARGB(255, 0, 0, 0)),
            hintText: 'Enter your email address',
          ),
        ),
      ],
    );
  }
}
