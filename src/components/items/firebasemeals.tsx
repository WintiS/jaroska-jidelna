import {component$, Resource, useResource$, useSignal, useStore, useTask$} from "@builder.io/qwik";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
    getStorage, ref, uploadBytes, getDownloadURL
} from "firebase/storage";
import {
    getFirestore, collection, onSnapshot,
    addDoc, query, where, getDocs
} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyA6njn4hz3Yz7dC6LAwBY5EB6do3oJxkTo",
    authDomain: "jaroska-jidelna.firebaseapp.com",
    projectId: "jaroska-jidelna",
    storageBucket: "jaroska-jidelna.appspot.com",
    messagingSenderId: "947035882834",
    appId: "1:947035882834:web:3965f23658d5640c3ca68b",
    measurementId: "G-WHSTF0W8B9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore()
const colRef = collection(db, "jidla")
const colRefNeOff = collection(db, "neofJidla")



export const FirebaseMeals = component$(() => {
    const query = useSignal("ku")
    const fetchAllMeals = useResource$<object[]>(async () => {
        const mealArray: any[] = []
        const querySnap = await getDocs(colRef)
        querySnap.forEach((meal) => {
            mealArray.push(meal.data())
        })
        return mealArray
    })

    // const getDownloadurl = useResource$(async (filename) => {
    //     getDownloadURL(ref(storage, filename))
    //         .then((downloadUrl) => {
    //             return downloadUrl
    //         })
    // })

    return(
        <div>
            <Resource
                value={fetchAllMeals}
                onResolved={(docs: any[]) =>
                    <div>
                        {docs.map(doc => (
                            <div key={doc.id}>
                                <p class={"text-white"}>{doc.jmeno}</p>
                            </div>
                            ))}
                    </div>
                    }
                />
        </div>
    )
})
