import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { Rating } from 'react-native-ratings';
import { Colors } from '../../constants/Colors';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import FlashMessage, { showMessage } from 'react-native-flash-message';

export default function Reviews({ business }) {
    const [rating, setRating] = useState(4);
    const [userInput, setUserInput] = useState('');
    const { user } = useUser();

    const onSubmit = async () => {
        if (!user || !business?.id) return;

        const docRef = doc(db, 'BusinessList', business.id);

        try {
            await updateDoc(docRef, {
                reviews: arrayUnion({
                    rating: rating,
                    comment: userInput,
                    userName: user?.fullName,
                    userImage: user?.imageUrl,
                    userEmail:user?.primaryEmailAddress?.emailAddress
                }),
            });
            Alert.alert(
                'Success',
                'Comment Added Successfully!',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: true }
            );
        } catch (error) {
            console.error('Error Adding Review:', error);
            Alert.alert(
                'Error',
                'Failed to add comment. Please try again.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: true }
            );
        }
    };

    return (
        <View style={{ padding: 20, backgroundColor: '#fff' }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>Reviews</Text>
            <View>
                <Rating
                    showRating={false}
                    imageSize={20}
                    onFinishRating={(rating) => setRating(rating)}
                    style={{ paddingVertical: 10 }}
                />
                <TextInput
                    placeholder='Write your comment'
                    multiline={true}
                    onChangeText={(value) => setUserInput(value)}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        borderColor: Colors.GRAY,
                        textAlignVertical: 'top',
                        height: 60
                    }}
                />
                <TouchableOpacity
                    disabled={!userInput}
                    onPress={onSubmit}
                    style={{
                        padding: 10,
                        borderRadius: 6,
                        backgroundColor: Colors.PRIMARY,
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontFamily: 'outfit',
                            textAlign: 'center',
                        }}
                    >
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
            <FlashMessage position="absolute" />
            {/* Display Previous Reviews */}
            
            <View>
                {business?.reviews?.map((item, index) => (
                    <View style={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 10,
                        alignItems:'center',
                        padding: 10,
                        borderWidth: 1,
                        borderColor: Colors.GRAY,
                        borderRadius: 15,
                        marginTop: 10

                    }}>
                        <Image source={{uri:item.userImage}}
                            style={{
                                width:50,
                                height:50,
                                borderRadius:99
                            }}
                        />
                        <View style={{
                            display:'flex',
                            gap:5
                        }}>
                            <Text style={{
                                fontFamily:'outfit-medium'
                            }}>{item.userName}</Text>
                            <Rating
                                imageSize={20}
                                startingValue={item.rating}
                                readonly={true}
                                style={{ alignItems:'flex-start'}}
                            />
                            <Text>{item.comment}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
