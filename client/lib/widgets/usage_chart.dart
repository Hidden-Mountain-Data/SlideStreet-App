import 'package:client/models/data_usage.dart';
import 'package:client/models/router.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

String selectedTimeFrame = '1 Week';

class RouterUsageCard extends StatefulWidget {
  final String title;
  final String totalUsage;
  final List<DataUsage> usageData;
  final List<Routers> routerData;

  const RouterUsageCard({
    super.key,
    required this.title,
    required this.totalUsage,
    required this.usageData,
    required this.routerData,
  });

  @override
  _RouterUsageCardState createState() => _RouterUsageCardState();
}

class _RouterUsageCardState extends State<RouterUsageCard> {
  int xAxisTitlesCount = 7;

  // A predefined color palette for routers
  final List<Color> routerColorsPalette = [
    Colors.blue,
    Colors.green,
    Colors.orange,
    Colors.purple,
    Colors.red,
    Colors.teal,
  ];

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        return Card(
          color: themeNotifier.isDarkMode
              ? const Color.fromARGB(255, 37, 37, 38)
              : const Color.fromARGB(255, 195, 195, 195),
          elevation: 4.0,
          margin: const EdgeInsets.all(16.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(themeNotifier),
                const SizedBox(height: 8.0),
                Text(
                  'Total Usage: ${widget.totalUsage}',
                  style: const TextStyle(
                      fontSize: 16.0, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8.0),
                const SizedBox(height: 16.0),
                _buildBarChart(themeNotifier),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeader(ThemeNotifier themeNotifier) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Usage',
          style: TextStyle(fontSize: 28.0, fontWeight: FontWeight.bold),
        ),
        _buildDropdownButton(themeNotifier),
      ],
    );
  }

  Widget _buildDropdownButton(ThemeNotifier themeNotifier) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
      decoration: BoxDecoration(
        color: themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 91, 91, 91)
            : const Color.fromARGB(255, 195, 195, 195),
        borderRadius: BorderRadius.circular(10),
      ),
      child: DropdownButton<String>(
        value: selectedTimeFrame,
        dropdownColor: themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 91, 91, 91)
            : const Color.fromARGB(255, 195, 195, 195),
        onChanged: (newValue) {
          setState(() {
            selectedTimeFrame = newValue!;
          });
        },
        items: ['1 Week', '1 Month', '6 Months', '1 Year']
            .map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(
              value,
              style: TextStyle(
                  color:
                      themeNotifier.isDarkMode ? Colors.white : Colors.black),
            ),
          );
        }).toList(),
        icon: Icon(
          Icons.arrow_drop_down,
          color: themeNotifier.isDarkMode ? Colors.white : Colors.black,
        ),
        iconSize: 32,
        underline: const SizedBox(),
      ),
    );
  }

  Widget _buildBarChart(ThemeNotifier themeNotifier) {
    return Container(
      height: 200.0,
      margin: const EdgeInsets.symmetric(vertical: 16.0),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceEvenly,
          maxY: getMaxUsageValue(),
          gridData: const FlGridData(
            drawHorizontalLine: false,
            drawVerticalLine: false,
          ),
          titlesData: _buildTitlesData(),
          borderData: _buildBorderData(themeNotifier),
          barGroups: getBarGroups(),
        ),
      ),
    );
  }

  FlTitlesData _buildTitlesData() {
    return FlTitlesData(
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          reservedSize: 36.0,
          showTitles: true,
          interval: getMaxUsageValue() / 5.0,
        ),
      ),
      bottomTitles: AxisTitles(
        axisNameSize: 16.0,
        sideTitles: SideTitles(
          showTitles: true,
          getTitlesWidget: getTitles,
        ),
        drawBelowEverything: true,
      ),
      rightTitles: const AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
      topTitles: const AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
    );
  }

  FlBorderData _buildBorderData(ThemeNotifier themeNotifier) {
    return FlBorderData(
      show: true,
      border: Border(
        bottom: BorderSide(
          color:
              themeNotifier.isDarkMode ? Colors.white : const Color(0xff37434d),
          width: 1,
        ),
        left: BorderSide(
          color:
              themeNotifier.isDarkMode ? Colors.white : const Color(0xff37434d),
          width: 1,
        ),
      ),
    );
  }

  double getMaxUsageValue() {
    double maxUsage = 0.0;
    for (final routerData in widget.usageData) {
      final double usageValue = double.parse(routerData.dataUsage) / 1000;
      if (usageValue > maxUsage) {
        maxUsage = usageValue;
      }
    }
    return maxUsage.truncate() + 1.0;
  }

  List<BarChartGroupData> getBarGroups() {
    final List<BarChartGroupData> barGroups = [];
    final routerColors = <String, Color>{};
    final List<String> uniqueDates = getUniqueDates();

    for (int index = 0; index < widget.usageData.length; index++) {
      final DataUsage routerData = widget.usageData[index];
      final Routers router = widget.routerData[index];
      final String routerName = router.name;
      final double usageValue = double.parse(routerData.dataUsage) / 1000;
      final int dateId = routerData.dateId;
      final String dateIdString = dateId.toString();
      final DateTime date = DateTime(
        int.parse(dateIdString.substring(0, 4)), // Year
        int.parse(dateIdString.substring(4, 6)), // Month
        int.parse(dateIdString.substring(6, 8)), // Day
      );

      if (isWithinTimeFrame(date)) {
        final groupIndex = getGroupingIndex(date);
        final colorIndex = index % routerColorsPalette.length;

        final color = routerColors.putIfAbsent(
          routerName,
          () => routerColorsPalette[colorIndex],
        );

        final existingBarGroupIndex =
            barGroups.indexWhere((group) => group.x == groupIndex);

        if (existingBarGroupIndex != -1) {
          barGroups[existingBarGroupIndex].barRods.add(
                BarChartRodData(
                  toY: usageValue,
                  width: 16.0,
                  color: color,
                ),
              );
        } else {
          barGroups.add(
            BarChartGroupData(
              x: groupIndex,
              barRods: [
                BarChartRodData(
                  toY: usageValue,
                  width: 16.0,
                  color: color,
                ),
              ],
            ),
          );
        }
      }
    }

    return barGroups;
  }

  int getGroupingIndex(DateTime date) {
    switch (selectedTimeFrame) {
      case '1 Week':
        return date.weekday - 1; // Index based on the day of the week (0-6)
      case '1 Month':
        return date.day - 1; // Index based on the day of the month (0-30/31)
      case '6 Months':
        return date.month - 1; // Index based on the month (0-11)
      case '1 Year':
        return (date.month - 1) ~/ 3; // Index based on the quarter (0-3)
      default:
        return 0;
    }
  }

  List<String> getUniqueDates() {
    final List<String> uniqueDates = [];

    for (final routerData in widget.usageData) {
      final int dateId = routerData.dateId;
      final String dateIdString = dateId.toString();
      final DateTime date = DateTime(
        int.parse(dateIdString.substring(0, 4)), // Year
        int.parse(dateIdString.substring(4, 6)), // Month
        int.parse(dateIdString.substring(6, 8)), // Day
      );
      if (!uniqueDates.contains(date) && isWithinTimeFrame(date)) {
        String dayOfWeekTitle = getDayOfWeekTitle(date.weekday - 1);
        uniqueDates.add(dayOfWeekTitle);
      }
    }

    return uniqueDates;
  }

  List<String> getUniqueWeekTitles() {
    List<String> uniqueWeekTitles = [];
    for (int index = 0; index < widget.usageData.length; index++) {
      final DataUsage routerData = widget.usageData[index];
      final int dateId = routerData.dateId;
      final String dateIdString = dateId.toString();
      final DateTime date = DateTime(
        int.parse(dateIdString.substring(0, 4)), // Year
        int.parse(dateIdString.substring(4, 6)), // Month
        int.parse(dateIdString.substring(6, 8)), // Day
      );
      int value = date.day - 1;
      if (isWithinTimeFrame(date)) {
        String weekTitle = getWeekOfMonthTitle(value);
        if (!uniqueWeekTitles.contains(weekTitle)) {
          uniqueWeekTitles.add(weekTitle);
        }
      }
    }

    return uniqueWeekTitles;
  }

  Widget getTitles(double value, TitleMeta meta) {
    const style = TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 14,
    );

    String text;

    switch (selectedTimeFrame) {
      case '1 Week':
        final List<String> uniqueDates = getUniqueDates();
        final int index = value.toInt();
        if (uniqueDates.contains(getDayOfWeekTitle(index))) {
          text = uniqueDates[index];
        } else {
          text = '';
        }
        break;
      case '1 Month':
        int index = value.toInt() - 1;
        List<String> uniqueWeekTitles = getUniqueWeekTitles();
        if (uniqueWeekTitles.contains(getWeekOfMonthTitle(index))) {
          text = getWeekOfMonthTitle(index);
        } else {
          text = '';
        }
        break;
      case '6 Months':
        text = getMonthTitle(value.toInt());
        break;
      case '1 Year':
        text = getQuarterTitle(value.toInt());
        break;
      default:
        text = '';
        break;
    }

    return SideTitleWidget(
      axisSide: meta.axisSide,
      space: 4,
      child: Text(text, style: style),
    );
  }
}

bool isWithinTimeFrame(DateTime date) {
  DateTime currentDate = DateTime.now();

  switch (selectedTimeFrame) {
    case '1 Week':
      return currentDate.difference(date).inDays.abs() < 7;
    case '1 Month':
      return currentDate.month == date.month && currentDate.year == date.year;
    case '6 Months':
      return currentDate.month >= date.month &&
          currentDate.year == date.year &&
          currentDate.month - date.month <= 6;
    case '1 Year':
      return currentDate.year == date.year;
    default:
      return false;
  }
}

String getDayOfWeekTitle(int index) {
  String text = '';
  switch (index + 1) {
    case 0:
      text = 'Sun';
    case 1:
      text = 'Mon';
    case 2:
      text = 'Tue';
    case 3:
      text = 'Wed';
    case 4:
      text = 'Thu';
    case 5:
      text = 'Fri';
    case 6:
      text = 'Sat';
  }
  print(text);
  return text;
}

String getWeekOfMonthTitle(int index) {
  // Calculate the week number based on the index
  int weekNumber = (index ~/ 7) + 1;

  return 'W$weekNumber';
}

String getMonthTitle(int index) {
  switch (index) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return '';
  }
}

String getQuarterTitle(int index) {
  switch (index) {
    case 0:
      return 'Q1';
    case 1:
      return 'Q2';
    case 2:
      return 'Q3';
    case 3:
      return 'Q4';
    default:
      return '';
  }
}
