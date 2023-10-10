import 'package:client/pages/sign_in.dart';
import 'package:client/pages/usage_page.dart';
import 'package:flutter/material.dart';

final emailController = TextEditingController();
final passwordController = TextEditingController();
final firstNameController = TextEditingController();
final lastNameController = TextEditingController();
final confirmPasswordController = TextEditingController();

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});
  @override
  SignUpPageState createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    firstNameController.dispose();
    lastNameController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Scaffold(
        backgroundColor: const Color.fromARGB(255, 187, 187, 187),
        appBar: AppBar(
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
                  const UsernameField(),
                  const SizedBox(height: 20),
                  const PasswordField(),
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
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const UsagePage()),
                      );
                    },
                    child: const Text('Sign Up',
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

class UsernameField extends StatelessWidget {
  const UsernameField({super.key});

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

class PasswordField extends StatefulWidget {
  const PasswordField({super.key});

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
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
          controller: passwordController,
          keyboardType: TextInputType.text,
          obscureText: !_passwordVisible,
          decoration: InputDecoration(
            border: InputBorder.none,
            filled: true,
            fillColor: const Color.fromARGB(255, 225, 225, 225),
            labelText: 'Password',
            hintText: 'Enter your password',
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
