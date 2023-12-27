import {component$} from "@builder.io/qwik";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const FirebaseMeals = component$(() => {
    return(
        <div>

        </div>
    )
})