import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/sign_up.dart';
import 'package:client/pages/usage_page.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/styles/button_styles.dart';
import 'package:client/widgets/apple_sign_in_button.dart';
import 'package:client/widgets/google_sign_in_button.dart';
import 'package:client/widgets/text_fields/email_text_field.dart';
import 'package:client/widgets/text_fields/password_text_field.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

final emailController = TextEditingController();
final passwordController = TextEditingController();

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;

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
              Text(
                "Sign In",
                style: GoogleFonts.openSans(
                  fontSize: 40,
                  fontWeight: FontWeight.w900,
                  color: const Color.fromARGB(255, 0, 0, 0),
                ),
              ),
              const SizedBox(width: 65),
            ],
          ),
        ),
        body: SingleChildScrollView(
          physics: const ClampingScrollPhysics(),
          child: Container(
            height: screenHeight - 85,
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
                      child: Text(
                        "Welcome back!",
                        style: GoogleFonts.openSans(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: const Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: InkWell(
                      onTap: () {},
                      child: Text(
                        "To keep connected with us, please login",
                        style: GoogleFonts.montserrat(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: const Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  EmailField(emailController: emailController),
                  const SizedBox(height: 40),
                  PasswordField(passwordController: passwordController),
                  const SizedBox(height: 20),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const SignUpPage()),
                        );
                      },
                      child: Text(
                        "Don't have an account? Sign up!",
                        style: GoogleFonts.montserrat(
                          fontSize: 20,
                          color: const Color.fromARGB(255, 127, 126, 128),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),
                  ElevatedButton(
                    style: raisedButtonStyle,
                    onPressed: () {
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
                    child: Text(
                      'Login',
                      style: GoogleFonts.openSans(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: const Color.fromARGB(255, 195, 250, 55),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: <Widget>[
                        const Divider(
                          height: 1,
                          color: Color.fromARGB(255, 127, 126, 128),
                        ),
                        Text(
                          'or continue with',
                          style: GoogleFonts.montserrat(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: const Color.fromARGB(255, 127, 126, 128),
                          ),
                        ),
                        const Divider(
                          height: 1,
                          color: Color.fromARGB(255, 127, 126, 128),
                        ),
                        const SizedBox(height: 20),
                        const AppleSignInButton(),
                        const SizedBox(height: 10),
                        const GoogleSignInButton(),
                        const SizedBox(height: 50),
                      ],
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
