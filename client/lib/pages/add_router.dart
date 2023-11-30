import 'package:client/models/router.dart';
import 'package:client/providers/router_service.dart';
import 'package:client/widgets/text_fields/other_text_field.dart';
import 'package:client/widgets/text_fields/large_text_field.dart';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AddRouterPage extends StatefulWidget {
  const AddRouterPage({super.key});

  @override
  _AddRouterPageState createState() => _AddRouterPageState();
}

class _AddRouterPageState extends State<AddRouterPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _simNumController = TextEditingController();
  final TextEditingController _imeiController = TextEditingController();
  final TextEditingController _SNController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

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
            Text(
              'Add Router',
              style: GoogleFonts.openSans(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: const Color.fromARGB(255, 0, 0, 0),
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
                    child: Text(
                      "Add new router",
                      style: GoogleFonts.montserrat(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
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
                      "To add a new router, please enter the router's information below",
                      style: GoogleFonts.montserrat(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: const Color.fromARGB(255, 0, 0, 0),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                OtherField(
                    textController: _nameController,
                    hintText: 'Input your device name',
                    labelText: 'Device Name'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _simNumController,
                    hintText: 'Input your sim number(ICCID)',
                    labelText: 'Sim Number(ICCID)'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _imeiController,
                    hintText: 'Input your IMEI number',
                    labelText: 'IMEI'),
                const SizedBox(height: 20),
                OtherField(
                    textController: _SNController,
                    hintText: 'Enter device\'s serial number',
                    labelText: 'Serial Number'),
                const SizedBox(height: 20),
                LargeTextField(
                  textController: _notesController,
                  hintText: 'Enter notes here',
                  labelText: 'Notes (Optional)',
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  style: raisedButtonStyle,
                  onPressed: () async {
                    try {
                      String name = _nameController.text;
                      String imei = _imeiController.text;
                      String iccid = _simNumController.text;
                      String serialNumber = _SNController.text;
                      String notes = _notesController.text;

                      // Validate input fields (add your own validation logic)
                      if (name.isEmpty || imei.isEmpty || iccid.isEmpty) {
                        // Show an error message or handle validation accordingly
                        return;
                      }

                      // Call the addRouter method from RouterService
                      Routers addedRouter = await RouterService().addRouter(
                        name,
                        imei,
                        iccid,
                        serialNumber,
                        notes,
                      );

                      // Handle success (addedRouter now contains the added router details)
                      print('Router added successfully: ${addedRouter.name}');

                      // Navigate back to the previous screen
                      Navigator.pop(context);
                    } catch (e) {
                      // Handle error (e.g., display an error message)
                      print('Error adding router: $e');
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Text('Add Router',
                        style: GoogleFonts.openSans(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: const Color.fromARGB(255, 195, 250, 55))),
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
