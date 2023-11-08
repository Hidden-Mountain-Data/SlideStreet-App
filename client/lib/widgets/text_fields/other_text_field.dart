import 'package:flutter/material.dart';

class OtherField extends StatelessWidget {
  const OtherField(
      {super.key,
      required this.textController,
      required this.hintText,
      required this.labelText});
  final TextEditingController textController;
  final String hintText;
  final String labelText;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          controller: textController,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: const Color.fromARGB(255, 225, 225, 225),
            labelText: labelText,
            hintStyle: const TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
            hintText: hintText,
          ),
        ),
      ],
    );
  }
}
