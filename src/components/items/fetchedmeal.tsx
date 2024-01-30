import {component$} from "@builder.io/qwik";

interface Props {
    jmeno: string,
    fileName: string,
    imageURL: string
}

export const Fetchedmeal = component$((props:Props) => {

    let modifiedURL = (props.imageURL)
    let extension = ("")
    let result = ([""])

    result = props.imageURL.split(".png")
    extension = ".png"
    if (result[1]){
        modifiedURL =  result[0] + "_200x200" + extension + result[1]
    }

    if(!result[1]){
        result = props.imageURL.split(".jpeg")
        extension = ".jpeg"
        modifiedURL =  result[0] + "_200x200" + extension + result[1]
    }
    if(!result[1]){
        result = props.imageURL.split(".jpg")
        extension = ".jpg"
        modifiedURL =  result[0] + "_200x200" + extension + result[1]
    }

    return(
        <div key={props.fileName} class={"flex items-center flex-col shadow mt-3 pb-1.5 mx-1 rounded bg-gray-900"}>
            <div>
                <img src={modifiedURL} alt={props.jmeno} loading={"lazy"} class={"rounded"} width={180} height={180}/>
            </div>
            <div class={"w-40 mt-1"}>
                <p class={"text-white text-sm"}>{props.jmeno}</p>
            </div>
        </div>
    )
})