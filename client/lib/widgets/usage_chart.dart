import 'package:client/models/data_usage.dart';
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

  const RouterUsageCard({
    super.key,
    required this.title,
    required this.totalUsage,
    required this.usageData,
  });

  @override
  _RouterUsageCardState createState() => _RouterUsageCardState();
}

class _RouterUsageCardState extends State<RouterUsageCard> {
  int xAxisTitlesCount = 7;

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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Usage',
                      style: TextStyle(
                          fontSize: 28.0, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 0),
                      decoration: BoxDecoration(
                          color: themeNotifier.isDarkMode
                              ? const Color.fromARGB(255, 91, 91, 91)
                              : const Color.fromARGB(255, 195, 195, 195),
                          borderRadius: BorderRadius.circular(10)),
                      child: DropdownButton<String>(
                        value: selectedTimeFrame,
                        dropdownColor: themeNotifier.isDarkMode
                            ? const Color.fromARGB(255, 91, 91, 91)
                            : const Color.fromARGB(255, 195, 195, 195),
                        onChanged: (newValue) {
                          setState(() {
                            selectedTimeFrame = newValue!;
                            updateXAxisTitlesCount();
                          });
                        },
                        items: ['1 Week', '1 Month', '6 Months', '1 Year']
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value,
                                style: TextStyle(
                                    color: themeNotifier.isDarkMode
                                        ? Colors.white
                                        : Colors.black)),
                          );
                        }).toList(),
                        icon: Icon(Icons.arrow_drop_down,
                            color: themeNotifier.isDarkMode
                                ? Colors.white
                                : Colors.black),
                        iconSize: 32,
                        underline: const SizedBox(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8.0),
                Text(
                  'Total Usage: ${widget.totalUsage}',
                  style: const TextStyle(
                      fontSize: 16.0, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8.0),
                const SizedBox(height: 16.0),
                Container(
                  height: 200.0,
                  margin: const EdgeInsets.symmetric(vertical: 16.0),
                  child: BarChart(
                    BarChartData(
                      alignment: BarChartAlignment.spaceEvenly,
                      maxY: getMaxUsageValue(),
                      gridData: const FlGridData(
                          drawHorizontalLine: false, drawVerticalLine: false),
                      titlesData: FlTitlesData(
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                              reservedSize: 36.0,
                              showTitles: true,
                              interval: getMaxUsageValue() / 5.0),
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
                      ),
                      borderData: FlBorderData(
                        show: true,
                        border: Border(
                            bottom: BorderSide(
                              color: themeNotifier.isDarkMode
                                  ? Colors.white
                                  : const Color(0xff37434d),
                              width: 1,
                            ),
                            left: BorderSide(
                              color: themeNotifier.isDarkMode
                                  ? Colors.white
                                  : const Color(0xff37434d),
                              width: 1,
                            )),
                      ),
                      barGroups: getBarGroups(),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
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

  void updateXAxisTitlesCount() {
    switch (selectedTimeFrame) {
      case '1 Week':
        xAxisTitlesCount = 7;
        break;
      case '1 Month':
        xAxisTitlesCount = 4;
        break;
      case '6 Months':
        xAxisTitlesCount = 6;
        break;
      case '1 Year':
        xAxisTitlesCount = 4;
        break;
      default:
        xAxisTitlesCount = 7;
    }
  }

  List<BarChartGroupData> getBarGroups() {
    final List<BarChartGroupData> barGroups = [];
    final routerColors = <String, Color>{};

    for (int index = 0; index < widget.usageData.length; index++) {
      final DataUsage routerData = widget.usageData[index];
      final String routerName = 'temp';
      final double usageValue = double.parse(routerData.dataUsage) / 1000;
      final DateTime date = DateTime.parse(routerData.createdAt!);

      if (isWithinTimeFrame(date)) {
        final color = routerColors.putIfAbsent(
          routerName,
          () => Color(
            (1.0 - (routerName.hashCode / 1000).abs() * 0xFFFFFF).toInt() << 0,
          ),
        );

        barGroups.add(
          BarChartGroupData(
            x: barGroups.length,
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

    return barGroups;
  }

  List<DateTime> getUniqueDates() {
    final List<DateTime> uniqueDates = [];

    for (final routerData in widget.usageData) {
      final DateTime date = DateTime.parse(routerData.createdAt!);
      if (!uniqueDates.contains(date)) {
        uniqueDates.add(date);
      }
    }

    return uniqueDates;
  }

  Widget getTitles(double value, TitleMeta meta) {
    const style = TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 14,
    );
    String text;

    switch (selectedTimeFrame) {
      case '1 Week':
        final int index = value.toInt();
        final DateTime date = getUniqueDates()[index];
        return Text(DateFormat('EEE').format(date));
      case '1 Month':
        text = getWeekOfMonthTitle(value.toInt());
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

String getDayOfWeekTitle(int index) {
  switch (index) {
    case 0:
      return 'Mn';
    case 1:
      return 'Te';
    case 2:
      return 'Wd';
    case 3:
      return 'Tu';
    case 4:
      return 'Fr';
    case 5:
      return 'St';
    case 6:
      return 'Sn';
    default:
      return '';
  }
}

bool isWithinTimeFrame(DateTime date) {
  DateTime currentDate = DateTime.now();

  switch (selectedTimeFrame) {
    case '1 Week':
      return currentDate.difference(date).inDays <= 7;
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

String getWeekOfMonthTitle(int index) {
  switch (index) {
    case 0:
      return 'W1';
    case 1:
      return 'W2';
    case 2:
      return 'W3';
    case 3:
      return 'W4';
    default:
      return '';
  }
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
