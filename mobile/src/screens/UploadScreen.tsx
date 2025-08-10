import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { videoApi } from '../services/api';

const UploadScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickVideo = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // 最大60秒
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setVideoUri(asset.uri);
        
        // 生成缩略图（这里简化处理，实际项目中可能需要更复杂的缩略图生成）
        if (asset.uri) {
          setThumbnailUri(asset.uri);
        }
      }
    } catch (error) {
      Alert.alert('错误', '选择视频时出现错误');
    }
  };

  const takeVideo = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限', '需要相机权限来录制视频');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setVideoUri(asset.uri);
        if (asset.uri) {
          setThumbnailUri(asset.uri);
        }
      }
    } catch (error) {
      Alert.alert('错误', '录制视频时出现错误');
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!videoUri) {
      Alert.alert('提示', '请先选择或录制视频');
      return;
    }

    if (!title.trim()) {
      Alert.alert('提示', '请输入视频标题');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: number) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
      } as any);

      await videoApi.uploadVideo(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      Alert.alert('成功', '视频上传成功！', [
        {
          text: '确定',
          onPress: () => {
            // 重置表单
            setTitle('');
            setDescription('');
            setVideoUri(null);
            setThumbnailUri(null);
            setUploadProgress(0);
          }
        }
      ]);
    } catch (error) {
      Alert.alert('错误', '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = (): void => {
    setVideoUri(null);
    setThumbnailUri(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>上传视频</Text>
        <Text style={styles.subtitle}>分享你的精彩内容</Text>
      </View>

      <View style={styles.form}>
        {/* 视频选择区域 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择视频</Text>
          
          {!videoUri ? (
            <View style={styles.videoPickerContainer}>
              <TouchableOpacity style={styles.pickerButton} onPress={pickVideo}>
                <Ionicons name="folder-open" size={32} color="#ff4757" />
                <Text style={styles.pickerButtonText}>从相册选择</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pickerButton} onPress={takeVideo}>
                <Ionicons name="camera" size={32} color="#ff4757" />
                <Text style={styles.pickerButtonText}>录制视频</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{ uri: videoUri }}
                style={styles.videoPreview}
                useNativeControls
                                 resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
              />
              
              <TouchableOpacity style={styles.removeButton} onPress={removeVideo}>
                <Ionicons name="close-circle" size={24} color="#ff4757" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 视频信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>视频信息</Text>
          
          <TextInput
            style={styles.input}
            placeholder="视频标题"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="视频描述"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 上传进度 */}
        {isUploading && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>上传进度</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          </View>
        )}

        {/* 上传按钮 */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!videoUri || isUploading) && styles.submitButtonDisabled
          ]} 
          onPress={handleUpload}
          disabled={!videoUri || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>上传视频</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  videoPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pickerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    minWidth: 120,
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  videoPreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a1a1a',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff4757',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UploadScreen;
