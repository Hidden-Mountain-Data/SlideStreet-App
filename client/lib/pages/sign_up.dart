import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/sign_in.dart';
import 'package:client/pages/usage_page.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/styles/button_styles.dart';
import 'package:client/widgets/text_fields/email_text_field.dart';
import 'package:client/widgets/text_fields/password_text_field.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

final emailController = TextEditingController();
final passwordController = TextEditingController();
final firstNameController = TextEditingController();
final lastNameController = TextEditingController();
final confirmPasswordController = TextEditingController();
final phoneNumberController = TextEditingController();

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});
  @override
  SignUpPageState createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  @override
  Widget build(BuildContext context) {
    return Material(
      child: Scaffold(
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
                height: 60,
              ),
              const Text(
                "Sign Up",
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.w900,
                  color: Color.fromARGB(255, 0, 0, 0),
                ),
              ),
              const SizedBox(width: 65),
            ],
          ),
        ),
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
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
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  const SizedBox(height: 40),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: InkWell(
                      onTap: () {},
                      child: const Text(
                        "Welcome!",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: InkWell(
                      onTap: () {},
                      child: const Text(
                        "To keep connected with us, please create an account",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: TextFormField(
                            controller: firstNameController,
                            keyboardType: TextInputType.text,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              filled: true,
                              fillColor: Color.fromARGB(255, 225, 225, 225),
                              labelText: 'First Name',
                              hintStyle: TextStyle(
                                  color: Color.fromARGB(255, 0, 0, 0)),
                              hintText: 'Enter your first name',
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 8.0),
                          child: TextFormField(
                            controller: lastNameController,
                            keyboardType: TextInputType.text,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              filled: true,
                              fillColor: Color.fromARGB(255, 225, 225, 225),
                              labelText: 'Last Name',
                              hintStyle: TextStyle(
                                  color: Color.fromARGB(255, 0, 0, 0)),
                              hintText: 'Enter your last name',
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  EmailField(emailController: emailController),
                  const SizedBox(height: 20),
                  const PhoneNumberField(),
                  const SizedBox(height: 20),
                  PasswordField(passwordController: passwordController),
                  const SizedBox(height: 20),
                  const ConfirmPasswordField(),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const LoginPage()),
                        );
                      },
                      child: const Text(
                        "Already have an account? Sign in!",
                        style: TextStyle(
                          fontSize: 20,
                          color: Color.fromARGB(255, 127, 126, 128),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 45),
                  ElevatedButton(
                    style: raisedButtonStyle,
                    onPressed: () {
                      UserService().register({
                        "email": emailController.text,
                        "password": passwordController.text,
                        "first_name": firstNameController.text,
                        "last_name": lastNameController.text,
                        "phone": phoneNumberController.text,
                      });

                      UserService().login({
                        "email": emailController.text,
                        "password": passwordController.text
                      }).then((user) {
                        if (user?.id != null) {
                          Provider.of<UserProvider>(context, listen: false)
                              .setUser(user!);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const UsagePage()),
                          );
                        } else {
                          showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: const Text('Invalid credentials'),
                                content: const Text(
                                  'Email or password is incorrect.',
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                    },
                                    child: const Text('OK'),
                                  ),
                                ],
                              );
                            },
                          );
                        }
                      });
                    },
                    child: const Text(
                      'Sign Up',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 195, 250, 55),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class ConfirmPasswordField extends StatefulWidget {
  const ConfirmPasswordField({super.key});

  @override
  State<ConfirmPasswordField> createState() => _ConfirmPasswordFieldState();
}

class _ConfirmPasswordFieldState extends State<ConfirmPasswordField> {
  late bool _passwordVisible;

  @override
  void initState() {
    super.initState();
    _passwordVisible = false;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          controller: confirmPasswordController,
          keyboardType: TextInputType.text,
          obscureText: !_passwordVisible,
          decoration: InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: const Color.fromARGB(255, 225, 225, 225),
            labelText: 'Confirm Password',
            hintText: 'Confirm your password',
            hintStyle: const TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
            suffixIcon: IconButton(
              icon: Icon(
                _passwordVisible ? Icons.visibility : Icons.visibility_off,
                color: Colors.black,
              ),
              onPressed: () {
                setState(() {
                  _passwordVisible = !_passwordVisible;
                });
              },
            ),
          ),
        ),
      ],
    );
  }
}

class PhoneNumberField extends StatefulWidget {
  const PhoneNumberField({super.key});

  @override
  State<PhoneNumberField> createState() => _PhoneNumberFieldState();
}

class _PhoneNumberFieldState extends State<PhoneNumberField> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextFormField(
          controller: phoneNumberController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: Color.fromARGB(255, 225, 225, 225),
            labelText: 'Phone Number',
            hintText: 'Enter your phone number',
            hintStyle: TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
          ),
        ),
      ],
    );
  }
}
