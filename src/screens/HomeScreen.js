import {
    ActivityIndicator,
    FlatList, Image,
    ImageBackground, Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, IconButton, MD3Colors, TextInput} from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


function HomeScreen({navigation})
{



    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

        fetch('https://chat-app-api-6a39.onrender.com/posts')
            .then((response) => response.json())
            .then((data) =>{
                setPosts(data);
                console.log(data)
            } )
            .catch((error) => console.error('Error fetching data: ', error))
            .finally(() => {
                setIsLoading(false);
            });

    }, []);
    const [state, setState] = useState(false);

    const [stories, setStories] = useState([
        {name: 'thima', id: '1', url: 'https://picsum.photos/id/1/200/300'},
        {name: 'thima', id: '2', url: 'https://picsum.photos/id/2/200/300'},
        {name: 'thima', id: '3', url: 'https://picsum.photos/id/3/200/300'},
        {name: 'thima', id: '4', url: 'https://picsum.photos/id/4/200/300'},
        {name: 'thima', id: '5', url: 'https://picsum.photos/id/5/200/300'},
    ]);
    const url = 'https://scontent.fjnb9-1.fna.fbcdn.net/v/t39.30808-6/347098544_1391128864791464_8389394536973812808_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGhTvYuZ072hs36i_ecb4mub4ctXZqge8Zvhy1dmqB7xrL1pnIVRrdlIwzkLELIK5KLIa1uSGvzTXcWW9c0dIFW&_nc_ohc=RHTMNSZ4GRMAX8FJauN&_nc_zt=23&_nc_ht=scontent.fjnb9-1.fna&oh=00_AfCVXrwsyiNFa9vVVG51x3FUYO0dKIYcZ_O7fkzJHV4Hcw&oe=6569D788';
    const [posts, setPosts] = useState([]);
    const [postModal, setPostModal] = useState(false);
    const [storyModal, setStoryModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo', // or 'video'
            quality: 1,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage({uri: response.assets[0].uri});
            }
        }).then(r =>{
            console.warn(r.errorMessage)
        });
    }
    function renderLoader() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{marginTop: 50}} size="large" color="blue" />
            </View>
        );
    }

    return (
        <SafeAreaView>
            {/*posts modal*/}
            <Modal visible={postModal} style={{margin:20, backgroundColor:'#56cbbf'}} animationType='slide'>
                <SafeAreaView>
                    <View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <IconButton onPress={()=>setPostModal(false)} size={24} mode='contained' style={{alignSelf:'flex-start', margin:5}} icon='close' />
                            <Button size={24}  mode='contained' style={{alignSelf:'flex-end', margin:5}} icon='upload' >Post</Button>
                        </View>
                        <TextInput
                            mode='outlined'
                            multiline={true}
                            style={{margin:10}}
                            placeholder='What`s on your mind? '
                        />
                        <Image source={{uri:''}} />
                        <View style={{flexDirection:'row'}}>

                        </View>

                    </View>
                </SafeAreaView>
            </Modal>


            <Modal visible={storyModal} style={{margin:20, backgroundColor:'#56cbbf'}} animationType='slide'>
                <SafeAreaView>
                    <View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <IconButton onPress={()=>setStoryModal(false)} size={24} mode='contained' style={{alignSelf:'flex-start', margin:5}} icon='close' />
                            <Button size={24}  mode='contained' style={{alignSelf:'flex-end', margin:5}} icon='upload' >Post</Button>
                        </View>
                        <IconButton onPress={()=> console.log('zz') } size={24} mode='contained' style={{alignSelf:'flex-start', margin:5}} icon='image' />

                        { selectedImage && <Image source={selectedImage} style={{ width: 200, height: 200 }} />}
                    </View>
                </SafeAreaView>
            </Modal>


            <View style={{flexDirection:'row', justifyContent:'flex-end', margin:5}}>
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
            <View style={{flexDirection:'row', alignItems:'center', margin:5 }}>
                <Avatar.Image size={35} style={{margin:5}} source={{uri: 'https://scontent.fjnb9-1.fna.fbcdn.net/v/t39.30808-6/347098544_1391128864791464_8389394536973812808_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGhTvYuZ072hs36i_ecb4mub4ctXZqge8Zvhy1dmqB7xrL1pnIVRrdlIwzkLELIK5KLIa1uSGvzTXcWW9c0dIFW&_nc_ohc=RHTMNSZ4GRMAX8FJauN&_nc_zt=23&_nc_ht=scontent.fjnb9-1.fna&oh=00_AfCVXrwsyiNFa9vVVG51x3FUYO0dKIYcZ_O7fkzJHV4Hcw&oe=6569D788'}} />
                <Button contentStyle={{flexDirection:'row-reverse', alignContent:'stretch'}} style={{flex:1, margin:5, flexDirection:'row-reverse', alignItems:'center'}} icon="camera" mode="text" onPress={() => setPostModal(true)}>
                    What`s on your mind?
                </Button>
            </View>


            <View style={{flexDirection:'row', alignContent:'center'}}>

                <ImageBackground
                    style={{
                        width: 100,
                        height: 200,
                        margin: 5,
                        flexDirection: 'column',
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        position: 'relative',
                    }}
                    imageStyle={{
                        resizeMode: 'cover',
                        borderRadius: 10,
                    }}
                    source={{ uri: url }}
                >

                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                                padding: 5,
                                borderRadius: 20,
                                margin:10
                            }}
                            onPress={() =>
                                setStoryModal(true)
                            }
                        >

                            <IconButton icon='plus' size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>


                <FlatList
                    data={stories}
                    style={{margin:5}}
                    horizontal={true}
                    keyExtractor={item => item.id}
                    snapToAlignment='center'
                    pagingEnabled={true}
                    renderItem={({item}) =>
                        (
                            <ImageBackground

                                style={{width:100,height:200, margin:5, flexDirection: 'column',
                                    flexGrow: 1,
                                    justifyContent: 'space-between',
                                    position: 'relative',}}
                                imageStyle={{resizeMode:'cover', borderRadius:10}}
                                source={{uri:item.url}} >

                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                                    <Text style={{margin:5, fontWeight:'bold', color:'white'}}>{item.name}</Text>
                                    {/*<TouchableOpacity
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                                        padding: 5,
                                        borderRadius: 20,
                                        margin:10
                                    }}
                                    onPress={() => {

                                    }}
                                >

                                    <IconButton icon='plus' size={25} color="black" />
                                </TouchableOpacity>*/}
                                </View>
                            </ImageBackground>
                        )
                    }/>

            </View>
            <View>
                {isLoading ? (
                    renderLoader()
                ) : (
                    <FlatList
                        data={posts}
                        snapToAlignment='center'
                        pagingEnabled={true}
                        style={{height:'100%'}}
                        renderItem={({item}) =>
                            (

                                <Card style={{margin:5}}>
                                    <View style={{padding:5, flexDirection:'row', alignItems:'center'}}>
                                        <Avatar.Image size={30} source={{uri:url}} />
                                        <View style={{flexDirection:'column', marginLeft:3}}>
                                            <Text>{item["full_names"]}</Text>
                                            <Text style={{fontSize:10}}>{item.created_at}</Text>
                                        </View>
                                    </View>
                                    <Card.Content style={{padding:0}}>
                                        <Text style={{marginLeft:0, marginTop:3, marginRight:0, marginBottom: 3}} variant="bodySmall">{item.post}</Text>
                                    </Card.Content>

                                    <Card.Cover style={{borderRadius:2}} source={{ uri: item.url }} />
                                    <Card.Actions>

                                    </Card.Actions>
                                </Card>

                            )} />

                )}
            </View>

        </SafeAreaView>
    );
}

export default HomeScreen;

