import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db, storage } from "../../configs/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function AddBusiness() {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const {user} = useUser();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [contact, setContact] = useState();
    const [website, setWebsite] = useState();
    const [about, setAbout] = useState();
    const [category, setCategory] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Add New Business',
            headerShown: true,
            headerStyle: {
                backgroundColor: Colors.PRIMARY
            }
        })
        getCategoryList();
    }, [])

    const onImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
          setImage(result?.assets[0].uri)
          console.log('result',result)
    }

    const getCategoryList = async () => {
        setCategoryList([])
        const q = query(collection(db, 'Category'));
        const snapShot = await getDocs(q);

        snapShot.forEach((doc) => {
            console.log('data', doc.data());
            setCategoryList(prev => [...prev, {
                label:(doc.data()).name,
                value:(doc.data()).name
            }])
        })
    }

    const onAddNewBusiness = async () => {
        setLoading(true);
        const fileName = Date.now().toString() + '.jpg';
        const resp = await fetch(image);
        const blob = await resp.blob();
        const imageRef = ref(storage, 'business-app/' + fileName);

        uploadBytes(imageRef, blob).then((snapshot) => {
            console.log('file uploaded successfully')
        }).then(resp => {
            getDownloadURL(imageRef).then(async (downloadUrl) => {
                console.log(downloadUrl);
                saveBusinessDetail(downloadUrl)
            })
        })
        setLoading(false);
    }

    const saveBusinessDetail = async (imageUrl) => {
        try {
            await setDoc(doc(db, 'BusinessList', Date.now().toString()),{
                name: name,
                contact: contact,
                address: address,
                website: website,
                about: about,
                category: category,
                username: user?.fullName,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userImage: user?.imageUrl,
                imageUrl: imageUrl
            });
            setLoading(false);
            showMessage({
                message: 'Business Added Successfully!',
                type: 'success',
                icon: { icon: 'success', position: 'left' },
                backgroundColor: Colors.PRIMARY,
                color: '#fff',
                duration: 2000,
                titleStyle: { textAlign: 'center' },
                descriptionStyle: { textAlign: 'center' },
                style: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5, borderRadius: 10, alignSelf: 'center', width: '70%', flexDirection: 'row'},
            });
        }  catch (error) {
            console.error('Error Adding Business:', error);
        }
    }

    return (
        <View style={{
            padding: 20
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 25
            }}>Add New Business</Text>
            <Text style={{
                fontFamily:'outfit',
                color: Colors.GRAY
            }}>Fill all details in order to add new business</Text>

            <TouchableOpacity style={{
                marginTop: 20
            }}
                onPress={() => onImagePick()}
            >
            {!image?
                <Image source={require('./../../assets/images/placeholder.png')}
                    style={{
                        height: 100,
                        width: 100
                    }}
                />
                :
                <Image source={{uri:image}}
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: 15
                    }}
                />
            }
            </TouchableOpacity>
            <View>
                <TextInput placeholder="Name"
                    onChangeText={ (v) => setName(v)}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        fontSize: 17,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY,
                        fontFamily: 'outfit'
                    }}
                />
                <TextInput placeholder="Address"
                    onChangeText={ (v) => setAddress(v)}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        fontSize: 17,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY,
                        fontFamily: 'outfit'
                    }}
                />
                <TextInput placeholder="Contact"
                    onChangeText={ (v) => setContact(v)}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        fontSize: 17,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY,
                        fontFamily: 'outfit'
                    }}
                />
                <TextInput placeholder="Website"
                    onChangeText={ (v) => setWebsite(v)}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        fontSize: 17,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY,
                        fontFamily: 'outfit'
                    }}
                />
                <TextInput placeholder="About"
                    onChangeText={ (v) => setAbout(v)}
                    multiline
                    numberOfLines={3}
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        fontSize: 17,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY,
                        fontFamily: 'outfit',
                        height: 100
                    }}
                />
                <View style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    marginTop: 10,
                    borderColor: Colors.PRIMARY,
                }}>
                    <RNPickerSelect
                        onValueChange={(value) => setCategory(value)}
                        items={categoryList}
                    />
                </View>
            </View>
            
            <TouchableOpacity 
                disabled={loading}
                style={{
                    padding: 15,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 15,
                    marginTop: 20,
                }}
                onPress={ () => onAddNewBusiness()}
            >
            {loading?
                <ActivityIndicator size={'large'} color={'#fff'} />
                :
                <Text style={{
                    textAlign: 'center',
                    fontFamily: 'outfit-medium',
                    color: '#fff'
                }}>Add New Business</Text>
            }
            </TouchableOpacity>
            <FlashMessage position="absolute"/>
        </View>
    )
}
