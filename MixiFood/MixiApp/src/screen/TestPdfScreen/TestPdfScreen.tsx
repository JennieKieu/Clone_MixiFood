import {Button, Text} from '@rneui/themed';
import {Component} from 'react';
import {Alert, Dimensions, Platform, StyleSheet, View} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Pdf from 'react-native-pdf';

export default class RNPrintExample extends Component {
  state = {
    selectedPrinter: null,
    pdfUri: null,
  };

  iosOptions = () => {
    return (
      <View>
        <Button title={'test'}></Button>
        <Button title={'test'}></Button>
      </View>
    );
  };

  choosePrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({x: '100', y: '100'});
    this.setState({selectedPrinter});
  };

  // @NOTE iOS Only
  silentPrint = async () => {
    if (!this.state.selectedPrinter) {
      Alert.alert('Must Select Printer First');
    }

    const jobName = await RNPrint.print({
      printerURL: this.state.selectedPrinter.url,
      html: '<h1>Silent Print</h1>',
    });
  };

  async printHTML() {
    await RNPrint.print({
      html: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>',
    });
  }

  async printPDF() {
    const results = await RNHTMLtoPDF.convert({
      html: '<h1>Custom converted PDF Document</h1>',
      fileName: 'test',
      base64: true,
    });

    await RNPrint.print({filePath: results.filePath});
  }

  async printRemotePDF() {
    await RNPrint.print({
      filePath: 'https://graduateland.com/api/v2/users/jesper/cv',
    });
  }

  customOptions = () => {
    return (
      <View>
        {this.state.selectedPrinter && (
          <View>
            <Text>{`Selected Printer Name: ${this.state.selectedPrinter.name}`}</Text>
            <Text>{`Selected Printer URI: ${this.state.selectedPrinter.url}`}</Text>
          </View>
        )}
        <Button onPress={this.choosePrinter} title="Select Printer" />
        <Button onPress={this.silentPrint} title="Silent Print" />
      </View>
    );
  };

  async createPDF() {
    const options = {
      html: '<h1>Custom PDF Document</h1>',
      fileName: 'test',
      directory: 'Documents', // Tùy chọn này có thể không cần thiết nếu không lưu file
      base64: true,
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      this.setState({pdfUri: file.filePath});
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && this.customOptions()}
        <Button onPress={this.printHTML} title="Print HTML" />
        <Button onPress={this.printPDF} title="Print PDF" />
        <Button onPress={this.printRemotePDF} title="Print Remote PDF" />

        <View style={{}}>
          <Button title="Generate PDF" onPress={() => this.createPDF()} />
          {this.state.pdfUri && (
            <View
              style={{
                position: 'absolute',
                flex: 1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}>
              <Pdf
                source={{uri: this.state.pdfUri, cache: true}}
                style={styles.pdf}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  // render() {
  //   return (

  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
