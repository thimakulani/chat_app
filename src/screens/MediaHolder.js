import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
const MediaHolder = ({ source, file_type }) => {
    if (file_type === 'video') {
        return (
            <View>

                <Video
                    //ref={video}
                    style={styles.video}
                    source={{
                        uri: source,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping={false}
                    //onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>
        );
    } else {
        return (
            <View>
                <Image
                    source={{ uri: source }}
                    style={{ width: '100%', height: 300 }} // Adjust width and height as needed
                />
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        height: 300,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default MediaHolder;
