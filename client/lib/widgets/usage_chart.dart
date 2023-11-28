import 'dart:math';

import 'package:client/models/data_usage.dart';
import 'package:client/models/router.dart';
import 'package:client/providers/router_service.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';
import 'package:intl/intl.dart';

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
  RouterService routerService = RouterService();
  double totalUsage = 0.0;
  String dateRangeText =
      '${DateFormat('yyyy/MM/dd').format(DateTime.now().subtract(const Duration(days: 6)).toLocal())} - ${DateFormat('yyyy/MM/dd').format(DateTime.now().toLocal())}';

  // A predefined color palette for routers
  final List<Color> routerColorsPalette = [
    const Color.fromARGB(255, 147, 193, 28),
    const Color.fromARGB(255, 36, 136, 254),
    const Color.fromARGB(255, 244, 146, 136),
    Colors.purple,
    const Color.fromARGB(255, 174, 150, 107),
    Colors.teal,
    Colors.pink,
  ];
  final Map<double, List<String>> usageValueToNameMap = {};

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(
              10.0,
            ),
            color: themeNotifier.isDarkMode
                ? const Color.fromARGB(255, 62, 62, 66)
                : const Color.fromARGB(255, 195, 195, 195),
            border: Border.all(
              color: themeNotifier.isDarkMode
                  ? const Color.fromARGB(255, 79, 79, 83)
                  : const Color.fromARGB(255, 212, 212, 212),
            ),
          ),
          margin: const EdgeInsets.all(16.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(themeNotifier),
                const SizedBox(height: 8.0),
                Text(
                  'Total Usage: ${totalUsage.toStringAsFixed(2)} Mb',
                  style: GoogleFonts.montserrat(
                      fontSize: 16.0, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8.0),
                Text(
                  'Date Range: $dateRangeText',
                  style: GoogleFonts.montserrat(
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
        Text(
          'Usage (Mb)',
          style: GoogleFonts.montserrat(
              fontSize: 28.0, fontWeight: FontWeight.bold),
        ),
        _buildDropdownButton(themeNotifier),
      ],
    );
  }

  Widget _buildDropdownButton(ThemeNotifier themeNotifier) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 0),
      decoration: BoxDecoration(
        color: themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 91, 91, 91)
            : const Color.fromARGB(255, 255, 255, 255),
        borderRadius: BorderRadius.circular(10),
      ),
      child: DropdownButton<String>(
        value: selectedTimeFrame,
        dropdownColor: themeNotifier.isDarkMode
            ? const Color.fromARGB(255, 91, 91, 91)
            : const Color.fromARGB(255, 255, 255, 255),
        onChanged: (newValue) {
          setState(() {
            selectedTimeFrame = newValue!;
            updateDateRangeText();
          });
        },
        items: ['1 Week', '1 Month', '6 Months', '1 Year']
            .map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(
              value,
              style: GoogleFonts.montserrat(
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

  void updateDateRangeText() {
    DateTime currentDate = DateTime.now();
    DateTime startDate;

    switch (selectedTimeFrame) {
      case '1 Week':
        startDate = currentDate.subtract(const Duration(days: 6));
        break;
      case '1 Month':
        startDate = DateTime(currentDate.year, currentDate.month, 1);
        break;
      case '6 Months':
        startDate = currentDate.subtract(const Duration(days: 180));
        break;
      case '1 Year':
        startDate =
            DateTime(currentDate.year - 1, currentDate.month, currentDate.day);
        break;
      default:
        startDate = currentDate;
    }

    // Format dates to 'yyyy-MM-dd'
    String formattedStartDate = DateFormat('yyyy/MM/dd').format(startDate);
    String formattedEndDate = DateFormat('yyyy/MM/dd').format(currentDate);

    dateRangeText = '$formattedStartDate - $formattedEndDate';
  }

  Widget _buildBarChart(ThemeNotifier themeNotifier) {
    final Map<String, double> totalUsagePerRouterAndGroup = {};
    for (int index = 0; index < widget.usageData.length; index++) {
      final DataUsage routerData = widget.usageData[index];
      if (routerData.routerId != null) {
        final Routers router = widget.routerData.firstWhere(
          (router) => router.routerId == routerData.routerId,
        );
        final String routerName = router.name;
        final double usageValue = double.parse(routerData.dataUsage) / 1048576;

        final int dateId = routerData.dateId;
        final String dateIdString = dateId.toString();
        final DateTime date = DateTime(
          int.parse(dateIdString.substring(0, 4)),
          int.parse(dateIdString.substring(4, 6)),
          int.parse(dateIdString.substring(6, 8)),
        );

        if (isWithinTimeFrame(date)) {
          final groupIndex = getGroupingIndex(date);

          // Combine usage for the same router name and group
          final String key = '$routerName-$groupIndex';
          totalUsagePerRouterAndGroup[key] =
              (totalUsagePerRouterAndGroup[key] ?? 0) + usageValue;
        }
      }
    }
    final Map<String, Color> routerColorMap = {};

    return Expanded(
      child: Column(
        children: [
          Expanded(
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceEvenly,
                maxY: getMaxUsageValue(totalUsagePerRouterAndGroup),
                gridData: const FlGridData(
                  drawHorizontalLine: false,
                  drawVerticalLine: false,
                ),
                titlesData: _buildTitlesData(totalUsagePerRouterAndGroup),
                borderData: _buildBorderData(themeNotifier),
                barGroups:
                    getBarGroups(totalUsagePerRouterAndGroup, routerColorMap),
                groupsSpace: 16,
                barTouchData: BarTouchData(
                  touchTooltipData: BarTouchTooltipData(
                    tooltipPadding: const EdgeInsets.all(8.0),
                    tooltipMargin: 8.0,
                    tooltipRoundedRadius: 8.0,
                    maxContentWidth: 500.0,
                    tooltipBgColor: themeNotifier.isDarkMode
                        ? const Color(0xFF1E1E1E)
                        : const Color(0xFFEFEFEF),
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      String routerName = '';
                      if (usageValueToNameMap.containsKey(rod.toY)) {
                        routerName = usageValueToNameMap[rod.toY]!.join(', ');
                      }

                      return BarTooltipItem(
                        '',
                        GoogleFonts.montserrat(
                          color: themeNotifier.isDarkMode
                              ? const Color.fromARGB(255, 255, 255, 255)
                              : const Color.fromARGB(255, 0, 0, 0),
                          fontSize: 14.0,
                        ),
                        children: [
                          TextSpan(
                            text: '$routerName: ',
                            style: GoogleFonts.montserrat(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextSpan(
                            text: '${rod.toY.toStringAsFixed(2)} Mb',
                          ),
                        ],
                      );
                    },
                  ),
                  handleBuiltInTouches: true,
                ),
              ),
            ),
          ),
          Wrap(
            direction: Axis.horizontal,
            alignment: WrapAlignment.spaceBetween,
            spacing: 4.0,
            runSpacing: 8.0,
            children: List.generate(
              widget.routerData.length,
              (index) => _buildLegendItem(
                routerName: widget.routerData[index].name,
                routerColor: routerColorMap[widget.routerData[index].name] ??
                    Colors.grey,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem({
    required String routerName,
    required Color routerColor,
  }) {
    // Check if the color is grey
    if (routerColor == Colors.grey) {
      // If the color is grey, don't display the legend item
      return const SizedBox(
        height: 0,
        width: 0,
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Wrap(
        direction: Axis.horizontal,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: [
          Container(
            width: 12.0,
            height: 12.0,
            decoration: BoxDecoration(
              color: routerColor,
              borderRadius: BorderRadius.circular(4.0),
            ),
          ),
          const SizedBox(width: 4.0),
          Text(
            routerName,
            style: GoogleFonts.montserrat(
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  FlTitlesData _buildTitlesData(totalUsagePerRouterAndGroup) {
    return FlTitlesData(
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          reservedSize: 45.0,
          showTitles: true,
          interval: getMaxUsageValue(totalUsagePerRouterAndGroup) / 5.0,
          getTitlesWidget: (double value, TitleMeta meta) {
            return SideTitleWidget(
              axisSide: meta.axisSide,
              space: 8,
              child: Text(
                value.toStringAsFixed(2),
                style: GoogleFonts.montserrat(
                  fontSize: 14.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            );
          },
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

  double getMaxUsageValue(Map<String, double> totalUsagePerRouterAndGroup) {
    double maxUsage = 0.0;

    // Iterate over the combined values and find the maximum
    for (final value in totalUsagePerRouterAndGroup.values) {
      if (value > maxUsage) {
        maxUsage = value;
      }
    }

    return maxUsage;
  }

  List<BarChartGroupData> getBarGroups(
      Map<String, double> totalUsagePerRouterAndGroup,
      Map<String, Color> routerColorMap) {
    final List<BarChartGroupData> barGroups = [];

    for (int index = 0; index < widget.usageData.length; index++) {
      final DataUsage routerData = widget.usageData[index];
      if (routerData.routerId != null) {
        final Routers router = widget.routerData.firstWhere(
          (router) => router.routerId == routerData.routerId,
        );
        final String routerName = router.name;
        final double usageValue = double.parse(routerData.dataUsage) / 1048576;

        usageValueToNameMap.putIfAbsent(usageValue, () => []);
        if (!usageValueToNameMap[usageValue]!.contains(routerName)) {
          usageValueToNameMap[usageValue]!.add(routerName);
        }

        final int dateId = routerData.dateId;
        final String dateIdString = dateId.toString();
        final DateTime date = DateTime(
          int.parse(dateIdString.substring(0, 4)),
          int.parse(dateIdString.substring(4, 6)),
          int.parse(dateIdString.substring(6, 8)),
        );

        if (isWithinTimeFrame(date)) {
          final groupIndex = getGroupingIndex(date);

          // Combine usage for the same router name and group
          final String key = '$routerName-$groupIndex';

          // Assign a unique color to each router
          if (!routerColorMap.containsKey(routerName)) {
            Set<Color> existingColors = Set.from(routerColorMap.values);
            routerColorMap[routerName] = _generateRandomColor(existingColors);
          }

          final existingBarGroupIndex =
              barGroups.indexWhere((group) => group.x == groupIndex);

          if (existingBarGroupIndex != -1) {
            // Check if a bar for the same router and x-axis combination already exists
            final existingBarGroup = barGroups[existingBarGroupIndex];
            final existingRodIndex = existingBarGroup.barRods.indexWhere(
              (rod) => rod.color == routerColorMap[routerName],
            );

            if (existingRodIndex != -1) {
              continue;
            } else {
              // Add a new rod for the router
              existingBarGroup.barRods.add(
                BarChartRodData(
                  borderRadius: const BorderRadius.all(Radius.zero),
                  toY: totalUsagePerRouterAndGroup[key]!,
                  width: 16.0,
                  color: routerColorMap[routerName],
                ),
              );
            }
          } else {
            barGroups.add(
              BarChartGroupData(
                x: groupIndex,
                barRods: [
                  BarChartRodData(
                    borderRadius: const BorderRadius.all(Radius.zero),
                    toY: totalUsagePerRouterAndGroup[key]!,
                    width: 16.0,
                    color: routerColorMap[routerName],
                  ),
                ],
              ),
            );
          }
        }
      }
    }

    double total = totalUsagePerRouterAndGroup.values.reduce((a, b) => a + b);
    totalUsage = total;

    return barGroups;
  }

  Color _generateRandomColor(Set<Color> existingColors) {
    final Random random = Random();

    // Define a subset of pastel-like colors in green, blue, and red spectrum
    final List<Color> pastelColors = [
      const Color.fromARGB(255, 61, 155, 64),
      const Color.fromARGB(255, 170, 102, 187),
      const Color.fromARGB(255, 226, 249, 144),
      Colors.blue[400]!,
      Colors.red[200]!,
      Colors.red[400]!,
    ];

    Color selectedColor = Colors.grey;

    // Try up to 10 times to find a distinct color
    for (int i = 0; i < 10; i++) {
      selectedColor = pastelColors[random.nextInt(pastelColors.length)];

      // Check the similarity with existing colors
      bool isDistinct = true;
      for (final existingColor in existingColors) {
        if (_isColorSimilar(selectedColor, existingColor)) {
          isDistinct = false;
          break;
        }
      }

      if (isDistinct) {
        break;
      }
    }

    existingColors.add(selectedColor);

    return selectedColor;
  }

  bool _isColorSimilar(Color color1, Color color2) {
    final double threshold = 30.0;

    // Calculate the difference in hue
    double hueDifference =
        (HSLColor.fromColor(color1).hue - HSLColor.fromColor(color2).hue).abs();

    // Ensure the hue difference is within the threshold
    hueDifference =
        hueDifference > 180.0 ? 360.0 - hueDifference : hueDifference;

    return hueDifference < threshold;
  }

  int getGroupingIndex(DateTime date) {
    switch (selectedTimeFrame) {
      case '1 Week':
        return date.weekday - 1; // Index based on the day of the week (0-6)
      case '1 Month':
        return (date.day - 1) ~/
            7; // Index based on the day of the month (0-30/31)
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
        int.parse(dateIdString.substring(0, 4)),
        int.parse(dateIdString.substring(4, 6)),
        int.parse(dateIdString.substring(6, 8)),
      );

      if (isWithinTimeFrame(date) && routerData.routerId != null) {
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
        int.parse(dateIdString.substring(0, 4)),
        int.parse(dateIdString.substring(4, 6)),
        int.parse(dateIdString.substring(6, 8)),
      );

      int value = date.day - 1;
      if (isWithinTimeFrame(date) && routerData.routerId != null) {
        String weekTitle = getWeekOfMonthTitle(value);
        if (!uniqueWeekTitles.contains(weekTitle)) {
          uniqueWeekTitles.add(weekTitle);
        }
      }
    }

    return uniqueWeekTitles;
  }

  Widget getTitles(double value, TitleMeta meta) {
    var style = GoogleFonts.montserrat(
      fontWeight: FontWeight.bold,
      fontSize: 14,
    );

    String text;

    switch (selectedTimeFrame) {
      case '1 Week':
        text = getDayOfWeekTitle(value.toInt());

        break;
      case '1 Month':
        int index = value.toInt();
        text = getWeekOfMonthTitle(index);

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
  switch (index) {
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
  return text;
}

String getWeekOfMonthTitle(int index) {
  int weekNumber = (index) + 1;

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
