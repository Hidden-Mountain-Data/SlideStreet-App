import 'package:client/pages/device_list.dart';
import 'package:client/pages/settings.dart';
import 'package:client/pages/usage_page.dart';
import 'package:flutter/material.dart';

class DeviceDetailsPage extends StatefulWidget {
  const DeviceDetailsPage({super.key});
  @override
  DeviceDetailsPageState createState() => DeviceDetailsPageState();
}

class DeviceDetailsPageState extends State<DeviceDetailsPage> {
  bool isSuspended = true;

  void toggleStatus() {
    setState(() {
      isSuspended = !isSuspended;
    });
  }

  @override
  Widget build(BuildContext context) {
    double containerWidth = MediaQuery.of(context).size.width - 32;

    Widget buildTextField(String label, String value, double height) {
      return Container(
        width: containerWidth,
        height: height,
        color: const Color.fromARGB(255, 195, 195, 195),
        padding: const EdgeInsets.all(8),
        margin: const EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 18),
            ),
          ],
        ),
      );
    }

    int currentIndex = 0;

    return Material(
      child: Scaffold(
        bottomNavigationBar: BottomNavigationBar(
          backgroundColor: const Color.fromARGB(255, 166, 166, 166),
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'List',
              backgroundColor: Color.fromARGB(255, 187, 187, 187),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Usage',
              backgroundColor: Color.fromARGB(255, 187, 187, 187),
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: 'Settings',
              backgroundColor: Color.fromARGB(255, 187, 187, 187),
            ),
          ],
          selectedItemColor: const Color.fromARGB(255, 195, 250, 55),
          currentIndex: currentIndex,
          onTap: (value) {
            setState(() {
              currentIndex = value;
            });
            switch (value) {
              case 0:
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const DeviceListPage()),
                );
                break;
              case 1:
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const UsagePage()),
                );
                break;
              case 2:
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SettingsPage()),
                );
                break;
            }
          },
        ),
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
                height: 50,
              ),
              const Text(
                "Device Details",
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: Color.fromARGB(255, 0, 0, 0),
                ),
              ),
              const IconButton(
                icon: Icon(Icons.person_outline_rounded,
                    size: 40, color: Colors.black),
                onPressed: null,
              ),
            ],
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 168, 168, 168),
        body: Column(
          children: [
            buildTextField('Router Name', 'routerName', 60),
            buildTextField('IMEI', 'imei', 60),
            buildTextField('SIM #', 'simNumber', 60),
            buildTextField('IP Address', 'ipAddress', 60),
            buildTextField('Notes', 'notes', 200),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(
                child: ElevatedButton(
                  onPressed: toggleStatus,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isSuspended ? Colors.red : Colors.green,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 16),
                  ),
                  child: Text(
                    isSuspended ? 'Suspended' : 'Reactivate',
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
