import 'package:client/widgets/text_fields/other_text_field.dart';
import 'package:client/widgets/text_fields/password_text_field.dart';

import 'package:flutter/material.dart';

class AddRouterPage extends StatefulWidget {
  const AddRouterPage({super.key});

  @override
  _AddRouterPageState createState() => _AddRouterPageState();
}

class _AddRouterPageState extends State<AddRouterPage> {
  final TextEditingController _simNumController = TextEditingController();
  final TextEditingController _imeiController = TextEditingController();
  final TextEditingController _ipController = TextEditingController();
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
              'Add Router',
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
                      "Add new router",
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
                      "To add a new router, please enter the router's information below",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color.fromARGB(255, 0, 0, 0),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                OtherField(
                    textController: _simNumController,
                    hintText: 'Input your sim number',
                    labelText: 'Sim Number'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _imeiController,
                    hintText: 'Input your IMEI number',
                    labelText: 'IMEI'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _ipController,
                    hintText: 'Enter device IP address',
                    labelText: 'IP Address'),
                const SizedBox(height: 20),
                PasswordField(passwordController: _passwordController),
                const SizedBox(height: 40),
                ElevatedButton(
                  style: raisedButtonStyle,
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Text('Add Router',
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
