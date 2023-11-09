import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:client/models/data_usage.dart';
import 'package:http/http.dart' as http;
import 'helpers.dart';

class DataUsageService {
  Future<DataUsage> fetchDataUsageBySim(int simId) async {
    final header = await getAuth();
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
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

  Future<List<DataUsage>> fetchDataUsage() async {
    final header = await getAuth();
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
    final response =
        await http.get(Uri.parse('$url/api/data-usage'), headers: header);
    if (response.statusCode == 200) {
      var jsonData = json.decode(response.body);
      var dataList = jsonData['data'] as List;
      return dataList.map((data) => DataUsage.fromJson(data)).toList();
    } else {
      throw Exception('Failed to fetch usage data');
    }
  }
}
