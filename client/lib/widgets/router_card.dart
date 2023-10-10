import 'package:client/pages/device_details.dart';
import 'package:flutter/material.dart';

class TopRoundedBorderShape extends ShapeBorder {
  const TopRoundedBorderShape();

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
      ..color = const Color.fromARGB(255, 205, 205, 205)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final roundedRect = RRect.fromRectAndCorners(
        Rect.fromLTRB(rect.left, rect.top, rect.right, rect.bottom),
        topLeft: const Radius.circular(10.0),
        topRight: const Radius.circular(10.0));

    canvas.drawRRect(roundedRect, borderPaint);
  }

  @override
  ShapeBorder scale(double t) {
    return const TopRoundedBorderShape();
  }
}

class RouterCard extends StatelessWidget {
  final String name;
  final String status;
  final double usage;
  final String signalStrength;

  const RouterCard({
    super.key,
    required this.name,
    required this.status,
    required this.usage,
    required this.signalStrength,
  });

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
    return Card(
      shape: const TopRoundedBorderShape(),
      child: ListTile(
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _getStatusColor(),
            border: Border.all(
                color: const Color.fromARGB(255, 205, 205, 205), width: 2),
          ),
        ),
        title: Text(
          name,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Status: $status',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Text(
              'Usage: $usage',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Text(
              'Signal Strength: $signalStrength',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ],
        ),
        trailing: const Icon(
          Icons.wifi,
          size: 50,
          color: Color.fromARGB(255, 0, 0, 0),
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const DeviceDetailsPage()),
          );
        },
      ),
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
  final String signalStrength;

  const RouterCard2({
    super.key,
    required this.name,
    required this.status,
    required this.usage,
    required this.signalStrength,
  });

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
    return Card(
      shape: ColoredTopRoundedBorderShape(_getStatusColor()),
      child: ListTile(
        title: Text(
          name,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Status: $status',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Text(
              'Usage: $usage',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Text(
              'Speed: $signalStrength',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ],
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const DeviceDetailsPage()),
          );
        },
      ),
    );
  }
}
