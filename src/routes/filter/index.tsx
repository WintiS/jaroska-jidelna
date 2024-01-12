import type { RequestHandler } from '@builder.io/qwik-city';
import {routeLoader$} from "@builder.io/qwik-city";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA6njn4hz3Yz7dC6LAwBY5EB6do3oJxkTo",
    authDomain: "jaroska-jidelna.firebaseapp.com",
    projectId: "jaroska-jidelna",
    storageBucket: "jaroska-jidelna.appspot.com",
    messagingSenderId: "947035882834",
    appId: "1:947035882834:web:3965f23658d5640c3ca68b",
    measurementId: "G-WHSTF0W8B9"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore()
const colRef = collection(db, "meals")

export const onGet: RequestHandler = async ({query, json}) => {
    const mealArray: { jmeno: string, fileName: string, imageURL: string }[] = []
    const querySnap = await getDocs(colRef)
    const filter = query.get("filter")


    querySnap.forEach((meal) => {
        if (filter){
            const normalizedFilter = filter
                .normalize("NFD") // Normalize diacritics
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            const normalizedMealName = meal.data().jmeno
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()

            if(normalizedMealName.includes(normalizedFilter)){
                mealArray.push(meal.data() as any)
            }else {
                return
            }

        }else{
            mealArray.push(meal.data() as any)
        }
    })

    json(200, {message: mealArray});
};

export const useMeals = routeLoader$(async ({cacheControl}) => {
    cacheControl({
        staleWhileRevalidate: 60 * 60 * 24, // day
        maxAge: 30, // seconds
    });

    const start = performance.now()



})