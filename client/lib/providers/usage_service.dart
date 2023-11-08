import 'dart:convert';
import 'package:client/models/data_usage.dart';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'helpers.dart';

class DataUsageService {
  Future<DataUsage> fetchDataUsage(int simId) async {
    final header = await getAuth();
    final url =
        Platform.isAndroid ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
    final response = await http.get(Uri.parse('$url/api/data-usage/$simId'),
        headers: header);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final usage = data['data'][0];
      return DataUsage.fromJson(usage);
    } else {
      throw Exception('Failed to fetch usage data');
    }
  }
}
