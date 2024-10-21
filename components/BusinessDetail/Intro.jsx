import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';

export default function Intro({business}) {
    
    const router = useRouter();
    const {user} = useUser();
    const OnDelete = () => {
        Alert.alert('Do you want to Delete?', 'Do you really want to Delete this business?',[
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteBusiness()
            }
        ])
    }

    const deleteBusiness = async () => {
        try {
            await deleteDoc(doc(db, 'BusinessList', business?.id));
            router.back();
        
            showMessage({
                message: 'Comment Added Successfully!',
                type: 'success',
                icon: { icon: 'success', position: 'left' },
                backgroundColor: Colors.PRIMARY,
                color: '#fff',
                duration: 2000,
                titleStyle: { textAlign: 'center' },
                descriptionStyle: { textAlign: 'center' },
                style: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5, borderRadius: 10, alignSelf: 'center', width: '70%', flexDirection: 'row'},
            });
        } catch (error){
            console.error('Error Deleting Business:', error);
        }
    }

    return (
        <View>
            <View style={{
                position:'absolute',
                zIndex:10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                padding:20
            }}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-circle" size={40} color="white" />
            </TouchableOpacity>
                <Ionicons name="heart-outline" size={40} color="white" />
            </View>
            <Image source={{ uri: business?.imageUrl }}
                style={{
                    width:'100%',
                    height: 340
                }}
            />
            <View style={{
                padding: 20,
                marginTop: -20,
                backgroundColor: '#fff',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    padding: 20,
                    marginTop: -20,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25
                }}>
                    <Text style={{
                    fontSize: 26,
                    fontFamily: 'outfit-bold',
                    }}>{business?.name}</Text>
                    <Text style={{
                    fontSize: 18,
                    fontFamily: 'outfit',
                    }}>{business?.address}</Text>
                </View>
                {
                    user?.primaryEmailAddress.emailAddress == business?.userEmail &&
                    <TouchableOpacity onPress={() => OnDelete()}>
                        <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                }
                    <FlashMessage position="absolute" />
                
            </View>
        </View>
    )
}