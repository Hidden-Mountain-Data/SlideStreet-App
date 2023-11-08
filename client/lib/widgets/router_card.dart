import 'package:client/pages/device_details.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class TopRoundedBorderShape extends ShapeBorder {
  final Color borderColor;
  const TopRoundedBorderShape(this.borderColor);

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.zero;

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) {
    return Path()
      ..addRRect(RRect.fromRectAndCorners(rect,
          topLeft: const Radius.circular(10.0),
          topRight: const Radius.circular(10.0)));
  }

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    return Path()
      ..addRRect(RRect.fromRectAndCorners(rect,
          topLeft: const Radius.circular(10.0),
          topRight: const Radius.circular(10.0)))
      ..addRect(
          Rect.fromLTRB(rect.left, rect.bottom - 6, rect.right, rect.bottom));
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    final borderPaint = Paint()
      ..color = borderColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final roundedRect = RRect.fromRectAndCorners(
        Rect.fromLTRB(rect.left, rect.top, rect.right, rect.bottom),
        topLeft: const Radius.circular(10.0),
        topRight: const Radius.circular(10.0));

    canvas.drawRRect(roundedRect, borderPaint);
  }

  @override
  ShapeBorder scale(double t) {
    return TopRoundedBorderShape(borderColor);
  }
}

class RouterCard extends StatelessWidget {
  final String name;
  final String status;
  final String usage;
  final String signalStrength;
  final String imei;
  final String simNumber;
  final String ipAddress;
  final String notes;

  const RouterCard(
      {super.key,
      required this.name,
      required this.status,
      required this.usage,
      required this.signalStrength,
      required this.imei,
      required this.simNumber,
      required this.ipAddress,
      required this.notes});

  Color _getStatusColor() {
    switch (status) {
      case 'Suspended':
        return Colors.yellow;
      case 'ACTIVE':
        return Colors.green;
      case 'Deactivated':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getWifiIcon() {
    if (signalStrength == 'Excellent') {
      return Icons.wifi;
    } else if (signalStrength == 'Good') {
      return Icons.wifi_2_bar;
    } else {
      return Icons.wifi_1_bar;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        Color borderColor = themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 74, 74, 74)
            : const Color.fromARGB(255, 205, 205, 205);
        return Card(
          shape: TopRoundedBorderShape(borderColor),
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _getStatusColor(),
                border: Border.all(
                    color: const Color.fromARGB(255, 99, 98, 98), width: 2),
              ),
            ),
            title: Text(
              name,
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: themeNotifier.isDarkMode
                      ? const Color.fromARGB(255, 255, 255, 255)
                      : Colors.black),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Status: $status',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 223, 223, 223)
                          : Colors.black),
                ),
                Text(
                  'Usage: $usage',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 223, 223, 223)
                          : Colors.black),
                ),
                Text(
                  'Signal Strength: $signalStrength',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 223, 223, 223)
                          : Colors.black),
                ),
              ],
            ),
            trailing: Icon(
              _getWifiIcon(),
              size: 50,
              color: themeNotifier.isDarkMode
                  ? const Color.fromARGB(255, 255, 255, 255)
                  : Colors.black,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => DeviceDetailsPage(
                          routerName: name,
                          imei: imei,
                          simNumber: simNumber,
                          ipAddress: ipAddress,
                          notes: notes,
                        )),
              );
            },
          ),
        );
      },
    );
  }
}

class ColoredTopRoundedBorderShape extends ShapeBorder {
  final Color color;

  const ColoredTopRoundedBorderShape(this.color);

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.zero;

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) {
    return Path()
      ..addRRect(RRect.fromRectAndCorners(rect,
          topLeft: const Radius.circular(10.0),
          topRight: const Radius.circular(10.0)));
  }

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    return Path()
      ..addRRect(RRect.fromRectAndCorners(rect,
          topLeft: const Radius.circular(10.0),
          topRight: const Radius.circular(10.0)))
      ..addRect(
          Rect.fromLTRB(rect.left, rect.bottom - 6, rect.right, rect.bottom));
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    final paint = Paint()..color = color;
    canvas.drawRect(
        Rect.fromLTRB(rect.left, rect.bottom - 6, rect.right, rect.bottom),
        paint);
  }

  @override
  ShapeBorder scale(double t) {
    return ColoredTopRoundedBorderShape(color);
  }
}

class RouterCard2 extends StatelessWidget {
  final String name;
  final String status;
  final double usage;
  final String speed;
  final String imei;
  final String simNumber;
  final String ipAddress;
  final String notes;

  const RouterCard2(
      {super.key,
      required this.name,
      required this.status,
      required this.usage,
      required this.speed,
      required this.imei,
      required this.simNumber,
      required this.ipAddress,
      required this.notes});

  Color _getStatusColor() {
    switch (status) {
      case 'Suspended':
        return Colors.yellow;
      case 'Active':
        return Colors.green;
      case 'Deactivated':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        return Card(
          shape: ColoredTopRoundedBorderShape(_getStatusColor()),
          child: ListTile(
            title: Text(
              name,
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: themeNotifier.isDarkMode
                      ? const Color.fromARGB(255, 207, 207, 207)
                      : Colors.black),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Status: $status',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 207, 207, 207)
                          : Colors.black),
                ),
                Text(
                  'Usage: $usage',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 207, 207, 207)
                          : Colors.black),
                ),
                Text(
                  'Speed: $speed',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: themeNotifier.isDarkMode
                          ? const Color.fromARGB(255, 207, 207, 207)
                          : Colors.black),
                ),
              ],
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => DeviceDetailsPage(
                          routerName: name,
                          imei: imei,
                          simNumber: simNumber,
                          ipAddress: ipAddress,
                          notes: notes,
                        )),
              );
            },
          ),
        );
      },
    );
  }
}
