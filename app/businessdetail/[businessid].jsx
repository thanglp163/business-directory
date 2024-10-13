import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Intro from '../../components/BusinessDetail/Intro';
import ActionButton from '../../components/BusinessDetail/ActionButton';
import About from '../../components/BusinessDetail/About';

export default function BusinessDetail() {

    const {businessid} = useLocalSearchParams();
    const [business, setBusiness] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        GetBusinessDetailById();
    }, [])
    /**
     * Used to get business detail by id
    */
    const GetBusinessDetailById = async () => {
        setLoading(true);
        const docRef = doc(db, 'BusinessList', businessid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setBusiness(docSnap.data());
            setLoading(false)
        } else {
            console.log("No such document!");
            setLoading(false)
        }
    }
    return (
        <ScrollView>
            {
                loading?
                <ActivityIndicator
                style={{
                    marginTop: '70%'
                }}
                    size={'large'}
                    color={Colors.PRIMARY}
                />:
                <View>
                    {/* Intro */}
                    <Intro business ={business}/>
                    {/* Action Button */}
                    <ActionButton business={business}/>
                    {/* About Section */}
                    <About business={business}/>
                </View>
            }
        </ScrollView>
    )
}