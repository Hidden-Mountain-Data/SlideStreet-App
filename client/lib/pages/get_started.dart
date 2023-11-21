import 'package:client/pages/sign_in.dart';
import 'package:client/styles/button_styles.dart';
import 'package:flutter/material.dart';

final emailController = TextEditingController();
final passwordController = TextEditingController();

class StartPage extends StatefulWidget {
  const StartPage({super.key});
  @override
  StartPageState createState() => StartPageState();
}

class StartPageState extends State<StartPage> {
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
        body: Container(
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
              mainAxisAlignment: MainAxisAlignment.center, // Center vertically
              children: <Widget>[
                Center(
                  child: Image.asset(
                    'assets/Original.png',
                    height: 150,
                  ),
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  style: raisedButtonStyle,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const LoginPage(),
                      ),
                    );
                  },
                  child: const Text(
                    'Get Started',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Color.fromARGB(255, 195, 250, 55),
                    ),
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
