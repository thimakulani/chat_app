import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet, ScrollView, Animated
} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {Avatar, Button, Card, IconButton, MD3Colors, TextInput} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

import {API_URL, fb_config} from "../data/Configs";
import {Video, ResizeMode} from 'expo-av';

import 'react-native-url-polyfill/auto'

import MediaHolder from "./MediaHolder";
import {MediaTypeOptions} from "expo-image-picker";

const storage = fb_config.storage();
const firestore = fb_config.firestore();

function HomeScreen({navigation}) {

    const flatListRef = useRef(null);
    const scrollOffset = useRef(new Animated.Value(0)).current;


    const current_date_time = () => {
        const currentDate = new Date();

        // Extract various parts of the date/time
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        // Format the date/time as needed
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    }
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingStories, setIsLoadingStories] = useState(true);

    const fetchStories = async () => {
        try {
            const collectionRef = firestore.collection('stories');
            const snapshot = await collectionRef.get();

            const data = [];
            snapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setStories(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoadingStories(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);


    const fetchPosts = async () => {


        fetch(`${API_URL}/posts`)
            .then((response) => response.json())
            .then((data) =>{
                setPosts(data);
                console.log(data)
            } )
            .catch((error) => console.error('Error fetching data: ', error))
            .finally(() => {
                setIsLoadingPosts(false);
            });

    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const url = 'https://firebasestorage.googleapis.com/v0/b/chat-app-7ab10.appspot.com/o/Images%2Ffile_2023_12_07_15_27_35_835?alt=media&token=9d9c38e5-7625-404d-b1f2-9cada2690d3e';
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [postModal, setPostModal] = useState(false);
    const [storyModal, setStoryModal] = useState(false);
    const [selectedStoryFile, setSelectedStoryFile] = useState(null);
    const [selectedPostFile, setSelectedPostFile] = useState(null);
    const [file_type, setFileType] = useState(null);
    const [post_content, setPostContent] = useState('');
    const [uploadProgress, setUploadProgress] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [isTopListVisible, setIsTopListVisible] = useState(true);


    const openImagePickerAsync = async () => {
        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                selectionLimit: 1,
                mediaTypes: MediaTypeOptions.All,
                allowsEditing: true
            });
            if (pickerResult.canceled === true) {
                return;
            }
            // setSelectedStoryFile(pickerResult.assets[0].uri);
            // const base64 = pickerResult.assets[0].base64;
            setSelectedStoryFile(pickerResult.assets[0]);
            setFileType(pickerResult.assets[0].type)
            //console.warn(base64);
        } catch (err) {
            console.log(err);
        }
    };
    const postsFilePicker = async () => {
        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                selectionLimit: 1,
                mediaTypes: MediaTypeOptions.All,
                allowsEditing: true
            });
            if (pickerResult.canceled === true) {
                return;
            }
            setSelectedPostFile(pickerResult.assets[0]);
            setFileType(pickerResult.assets[0].type)
        } catch (err) {
            console.log(err);
        }
    };

    function getCurrentDateTime() {
        const now = new Date();

        // Get individual date and time components
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so adding 1 and padding with zero if necessary
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${milliseconds}`;
    }

    const uploadStory = async () => {
        try {
            const response = await fetch(selectedStoryFile.uri);
            const blob = await response.blob();
            const storageRef = storage.ref('File').child('file_' + getCurrentDateTime());
            const uploadTask = storageRef.put(blob);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Calculate upload progress percentage
                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                    console.log(`Upload is ${progress}% done`);
                    // Update your UI with the upload progress
                    // For example, set the progress in a progress bar
                },
                (error) => {
                    console.log('Error uploading file:', error);
                },
                () => {
                    // Upload completed successfully
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        firestore.collection('stories')
                            .add({user_id: 1, url: downloadURL, file_type: file_type, created_at: current_date_time()})
                            .then((fs_snapshot) => {
                                console.warn('Story has been added');
                            }).catch((error) => {
                            console.log('Error saving data :', error);
                        });
                    }).catch(async (error) => {
                        console.log('Error saving data:', error);
                        try {
                            await uploadTask.snapshot.ref.delete();
                            console.warn('Uploaded data deleted due to insertion failure');
                        } catch (deleteError) {
                            console.error('Error deleting uploaded data:', deleteError);

                        }
                    });
                }
            );
        } catch (error) {
            console.log('Error fetching or processing the file:', error);
        }
    };
    const uploadPost = async () => {
        try {
            if(selectedPostFile !=null)
            {
                setShowProgress(true);
                setPostModal(false)
                const response = await fetch(selectedPostFile.uri);
                const blob = await response.blob();
                const storageRef = storage.ref('File').child('file_' + getCurrentDateTime());
                const uploadTask = storageRef.put(blob);


                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Calculate upload progress percentage
                        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                        //console.log(`Upload is ${progress}% done`);
                        setUploadProgress(`Upload is ${progress}% done`);
                        // Update your UI with the upload progress
                        // For example, set the progress in a progress bar
                        console.log(uploadProgress);
                    },
                    (error) => {
                        console.log('Error uploading file:', error);
                        setShowProgress(false);
                        setPostModal(false)

                    },
                    () => {
                        // Upload completed successfully
                        setPostModal(false)
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

                            const postData = {
                                url: downloadURL,
                                post: post_content,
                                file_type: file_type
                            };
                            add_post(postData);

                        }).catch(async (error) => {
                            console.log('Error saving data: ', error);

                            try {
                                await uploadTask.snapshot.ref.delete();
                                console.warn('Uploaded data deleted due to insertion failure');
                            } catch (deleteError) {
                                console.error('Error deleting uploaded data:', deleteError);
                            }
                        });
                    }
                );
            }
            else{
                const postData = {
                    url: null,
                    post: post_content,
                    file_type: 'post'
                };
                add_post(postData);
            }
        } catch (error) {
            console.log('Error fetching or processing the file:', error);

        } finally {
            setShowProgress(false);
            setPostModal(false)
        }

    };

    function add_post(data){
        fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) // Convert data to JSON string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response data
                console.log('Success:', data);
                // Perform actions with the response data as needed
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }

    function renderLoader() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator style={{marginTop: 50, alignSelf: 'center'}} size="large" color="blue"/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{backgroundColor: '#dadce0'}}>
            <Modal visible={postModal} transparent={true} animationType='slide'>
                <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                    <View style={{borderRadius: 10, margin: 20, flex: 1, backgroundColor: 'white', padding: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <IconButton onPress={() => {
                                setPostModal(false);
                                setSelectedPostFile(null)
                            }} size={24} mode='contained' style={{alignSelf: 'flex-start', margin: 5}} icon='close'/>

                            <Button size={24} onPress={uploadPost} mode='contained'
                                    style={{alignSelf: 'flex-end', margin: 5}} icon='upload'>Post</Button>
                        </View>
                        <TextInput
                            mode='outlined'
                            multiline={true}
                            style={{margin: 10}}
                            placeholder='What`s on your mind?'
                            value={post_content}
                            onChangeText={v => setPostContent(v)}

                        />
                        <View style={{flexDirection: 'row'}}>
                            <IconButton onPress={postsFilePicker}
                                        size={24} mode='contained' style={{alignSelf: 'flex-start', margin: 5}}
                                        icon='file'/>
                        </View>
                        <View style={{flex: 1}}>
                            {selectedPostFile && selectedPostFile.type === 'image' &&
                                <Image resizeMode='contain' source={{uri: selectedPostFile.uri}}
                                       style={{width: '100%', height: '100%', borderRadius: 10}}/>}
                            {selectedPostFile && selectedPostFile.type === 'video' &&
                                <Video resizeMode='cover' source={{uri: selectedPostFile.uri}}
                                       style={{width: '100%', height: '100%', borderRadius: 10}}
                                       useNativeControls isLooping={false}/>}
                        </View>


                    </View>
                </SafeAreaView>
            </Modal>


            <Modal visible={storyModal} transparent={true} animationType='slide'>
                <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                    <View style={{borderRadius: 10, margin: 20, flex: 1, backgroundColor: 'white', padding: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <IconButton onPress={() => {
                                setStoryModal(false);
                                setSelectedStoryFile(null)
                            }} size={24} mode='contained' style={{alignSelf: 'flex-start', margin: 5}} icon='close'/>
                            <Button size={24} mode='contained' style={{alignSelf: 'flex-end', margin: 5}} icon='upload'
                                    onPress={uploadStory}>Post</Button>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <IconButton onPress={openImagePickerAsync} size={24} mode='contained'
                                        style={{alignSelf: 'flex-start', margin: 5}} icon='image'/>

                        </View>
                        <View style={{flex: 1}}>
                            {selectedStoryFile && selectedStoryFile.type === 'image' &&
                                <Image resizeMode='contain' source={{uri: selectedStoryFile.uri}}
                                       style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10}}/>}
                            {selectedStoryFile && selectedStoryFile.type === 'video' &&
                                <Video source={{uri: selectedStoryFile.uri}}
                                       style={{width: '100%', height: '100%', borderRadius: 10}}
                                       useNativeControls
                                       resizeMode={ResizeMode.COVER}
                                       isLooping={false}/>}
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 5}}>
                <IconButton
                    icon="plus"
                    color={MD3Colors.secondary40}
                    mode='outlined'
                    size={20}
                />
                <IconButton
                    icon="barcode-scan"
                    color={MD3Colors.secondary40}
                    mode='outlined'
                    size={20}
                />
                <IconButton
                    icon="message"
                    color={MD3Colors.secondary40}
                    size={20}
                    mode='outlined'
                />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
                <Avatar.Image size={35} style={{margin: 5}}
                              source={{uri: 'https://scontent.fjnb9-1.fna.fbcdn.net/v/t39.30808-6/347098544_1391128864791464_8389394536973812808_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGhTvYuZ072hs36i_ecb4mub4ctXZqge8Zvhy1dmqB7xrL1pnIVRrdlIwzkLELIK5KLIa1uSGvzTXcWW9c0dIFW&_nc_ohc=RHTMNSZ4GRMAX8FJauN&_nc_zt=23&_nc_ht=scontent.fjnb9-1.fna&oh=00_AfCVXrwsyiNFa9vVVG51x3FUYO0dKIYcZ_O7fkzJHV4Hcw&oe=6569D788'}}/>
                <Button contentStyle={{flexDirection: 'row-reverse', alignContent: 'stretch'}}
                        style={{flex: 1, margin: 5, flexDirection: 'row-reverse', alignItems: 'center'}} icon="camera"
                        mode="text" onPress={() => setPostModal(true)}>
                    What`s on your mind?
                </Button>
            </View>


            <ScrollView
                nestedScrollEnabled={true}
                style={{flexDirection:'column', height:'100%'}}
            >


                    <View
                        style={{flexDirection: 'row'}}>
                        <View
                            style={{
                                width: 50,
                                height: 150,
                                margin: 5,
                                flexDirection: 'column',
                                flexGrow: 1,
                                justifyContent: 'space-between',
                                position: 'relative',

                            }}


                        >

                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                                        padding: 5,
                                        borderRadius: 20,
                                        margin: 10,
                                    }}
                                    onPress={() =>
                                        setStoryModal(true)
                                    }
                                >

                                    <IconButton icon='plus' size={25} color="black"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <FlatList
                            data={stories}
                            style={{
                                margin: 5
                            }}
                            horizontal={true}
                            keyExtractor={item => item.id}
                            snapToAlignment='center'
                            pagingEnabled={true}
                            renderItem={({item}) =>
                                (
                                    <ImageBackground
                                        style={{
                                            width: 100, height: 150, margin: 5, flexDirection: 'column',
                                            flexGrow: 1,
                                            backgroundColor: 'white',
                                            borderRadius: 10,
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                        }}

                                        imageStyle={{resizeMode: 'cover', borderRadius: 10}}
                                        source={{uri: item.url}}>

                                        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>

                                            <View style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                width: '100%',
                                                margin: 10
                                            }}>
                                                <Text style={{
                                                    margin: 5,
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    borderRadius: 10
                                                }}>{item.f_name}</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                )
                            }/>

                    </View>


                    <View style={{backgroundColor:'transparent', flex:1, height:'100%'}}>
                        {isLoadingPosts ? (
                            renderLoader()
                        ) : (
                            <Animated.FlatList
                                data={posts}
                                scrollEnabled={false}
                                snapToAlignment='center'
                                pagingEnabled={true}

                                keyExtractor={item => item.id}
                                ref={flatListRef}
                                overScrollMode='never'
                                onScroll={Animated.event(
                                    [{nativeEvent: {contentOffset: {y: scrollOffset}}}],
                                    {useNativeDriver: true}
                                )}
                                renderItem={({item}) =>
                                    (

                                        <Card style={{margin: 5}}>
                                            <View style={{padding: 5, flexDirection: 'row', alignItems: 'center'}}>
                                                <Avatar.Image size={30} source={{uri: url}}/>
                                                <View style={{flexDirection: 'column', marginLeft: 3}}>
                                                    <Text>{item["full_names"]}</Text>
                                                    <Text style={{fontSize: 10}}>{item.created_at}</Text>
                                                </View>
                                            </View>
                                            <Card.Content style={{padding: 0}}>
                                                <Text style={{
                                                    marginLeft: 0,
                                                    marginTop: 3,
                                                    marginRight: 0,
                                                    marginBottom: 3
                                                }}
                                                      variant="bodySmall">{item.post}</Text>
                                            </Card.Content>


                                            <MediaHolder source={item.url} file_type={item.file_type}/>

                                        </Card>

                                    )}/>

                        )}
                    </View>
            </ScrollView>


        </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    openButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    closeButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 10,
    },
});