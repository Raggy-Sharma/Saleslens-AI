import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadExcel } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function UploadScreen() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    if (!result.canceled && result.assets.length > 0) setFile(result.assets[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadExcel({ uri: file.uri, name: file.name, type: file.mimeType });
      navigation.navigate('Home', { reload: true });
      setFile(null);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.detail || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Button title="Pick Excel File" onPress={pickFile} />
      {file && <Text style={{ marginVertical: 10 }}>{file.name}</Text>}
      {file && <Button title="Upload" onPress={handleUpload} disabled={uploading} />}
      {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}
