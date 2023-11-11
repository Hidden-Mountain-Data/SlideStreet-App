import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class DeviceDetailsPage extends StatefulWidget {
  const DeviceDetailsPage({
    Key? key,
    required this.routerName,
    required this.imei,
    required this.simNumber,
    required this.ipAddress,
    required this.notes,
  }) : super(key: key);

  final String routerName;
  final String imei;
  final String simNumber;
  final String ipAddress;
  final String notes;

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

    Widget buildTextField(String label, String value, double height,
        Color color, Color borderColor) {
      return Container(
        width: containerWidth,
        height: height,
        decoration: BoxDecoration(
          color: color,
          border: Border.all(
            color: borderColor,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(5),
          shape: BoxShape.rectangle,
        ),
        padding: const EdgeInsets.all(8),
        margin: const EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 5),
            Text(
              value,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w400),
            ),
          ],
        ),
      );
    }

    return Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        Color cardColor = themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 62, 62, 66)
            : const Color.fromARGB(255, 192, 191, 192);
        Color borderColor = themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 74, 74, 74)
            : const Color.fromARGB(255, 205, 205, 205);

        return Material(
          child: Scaffold(
            backgroundColor: themeNotifier.isDarkMode
                ? const Color.fromARGB(255, 37, 37, 38)
                : const Color.fromARGB(255, 168, 168, 168),
            bottomNavigationBar: const BottomNav(currentIndex: 0),
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
                  Text(
                    'Device Details',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 255, 255, 255)
                          : const Color.fromARGB(255, 0, 0, 0),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.chevron_left_rounded,
                      size: 40,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 255, 255, 255)
                          : const Color.fromARGB(255, 0, 0, 0),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            ),
            body: ListView(
              physics: const ClampingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                const SizedBox(height: 20),
                buildTextField('Router Name', widget.routerName, 70, cardColor,
                    borderColor),
                buildTextField('IMEI', widget.imei, 70, cardColor, borderColor),
                buildTextField(
                    'SIM #', widget.simNumber, 70, cardColor, borderColor),
                buildTextField(
                    'IP Address', widget.ipAddress, 70, cardColor, borderColor),
                buildTextField(
                    'Notes', widget.notes, 120, cardColor, borderColor),
                const SizedBox(height: 20),
                Center(
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
                const SizedBox(height: 20),
              ],
            ),
          ),
        );
      },
    );
  }
}
