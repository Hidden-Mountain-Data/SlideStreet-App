import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/sign_up.dart';
import 'package:client/pages/usage_page.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/widgets/text_fields/email_text_field.dart';
import 'package:client/widgets/text_fields/password_text_field.dart';
import 'package:flutter/material.dart';
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
                "Sign In",
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
        body: Container(
          decoration: const BoxDecoration(
              gradient: LinearGradient(
            begin: FractionalOffset(0.0, 1),
            end: FractionalOffset(0, 0.7),
            colors: [
              Color.fromARGB(255, 195, 250, 55),
              Color.fromARGB(255, 187, 187, 187),
            ],
          )),
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
                      "Welcome back!",
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
                      "To keep connected with us, please login",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color.fromARGB(255, 0, 0, 0),
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
                    child: const Text(
                      "Don't have an account? Sign up!",
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
                  child: const Text('Login',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 195, 250, 55))),
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
  shape: const RoundedRectangleBorder(
    borderRadius: BorderRadius.all(Radius.circular(20)),
  ),
);
