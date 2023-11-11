import 'package:client/widgets/text_fields/email_text_field.dart';
import 'package:client/widgets/text_fields/other_text_field.dart';
import 'package:client/widgets/text_fields/password_text_field.dart';
import 'package:flutter/material.dart';

class EditInformationPage extends StatefulWidget {
  const EditInformationPage({super.key});

  @override
  _EditInformationPageState createState() => _EditInformationPageState();
}

class _EditInformationPageState extends State<EditInformationPage> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 187, 187, 187),
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 187, 187, 187),
        automaticallyImplyLeading: false,
        leading: null,
        toolbarHeight: 75,
        centerTitle: true,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              'assets/Original.png',
              height: 50,
            ),
            const Text(
              'Profile',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: Color.fromARGB(255, 0, 0, 0),
              ),
            ),
            IconButton(
              icon: const Icon(
                Icons.chevron_left_rounded,
                size: 40,
                color: Color.fromARGB(255, 0, 0, 0),
              ),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        physics: const ClampingScrollPhysics(),
        child: Container(
          height: MediaQuery.of(context).size.height - 70,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: FractionalOffset(0.0, 1),
              end: FractionalOffset(0, 0.7),
              colors: [
                Color.fromARGB(255, 195, 250, 55),
                Color.fromARGB(255, 187, 187, 187),
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 20),
                Align(
                  alignment: Alignment.centerLeft,
                  child: InkWell(
                    onTap: () {},
                    child: const Text(
                      "Edit Information",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color.fromARGB(255, 0, 0, 0),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                OtherField(
                    textController: _firstNameController,
                    hintText: 'First Name',
                    labelText: 'Edit your first name'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _lastNameController,
                    hintText: 'Last Name',
                    labelText: 'Edit your last name'),
                const SizedBox(height: 20),
                EmailField(emailController: _emailController),
                const SizedBox(height: 20),
                const Align(
                  child: Text(
                    "To modify personal information, please enter your password to confirm your identity",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color.fromARGB(255, 0, 0, 0),
                    ),
                  ),
                ),
                const SizedBox(height: 30),
                PasswordField(passwordController: _passwordController),
                const SizedBox(height: 30),
                ElevatedButton(
                  style: raisedButtonStyle,
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Text('Save',
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color.fromARGB(255, 195, 250, 55))),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

final ButtonStyle raisedButtonStyle = ElevatedButton.styleFrom(
  minimumSize: const Size(double.maxFinite, 50),
  backgroundColor: Colors.black,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(30.0),
  ),
);
