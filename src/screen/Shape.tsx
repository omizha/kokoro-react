import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    ImageList,
    ImageListItem,
    MenuItem,
    Radio,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { baseURL } from "../config";
import axiosInstance from "../lib/axiosInstance";
import { UiFileInputButton } from "../components/primitive/UIFileInputButton";
import { RadioGroup, Select } from "formik-mui";
import { useMutation } from "@apollo/client";
import { setPlaceGql } from "../lib/apollo/gql";

const Shape = (props) => {
    const { router, status, content, image } = props;
    const [thumb, setThumb] = useState<string[]>(image ?? []);
    const [progress, setProgress] = useState<number>(0);
    const onChange = useCallback(
        async (formData: FormData) => {
            const config = {
                headers: { "content-type": "multipart/form-data" },
                onUploadProgress: (event: {
                    loaded: number;
                    total: number;
                }) => {
                    setProgress(Math.round((event.loaded * 100) / event.total));
                },
            };

            axiosInstance()
                .post<any>("/api/board/upload-images", formData, config)
                .then((res) => {
                    const tmpThumb = [...res.data.files.map((v) => v.filename)];

                    setThumb(tmpThumb);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [thumb]
    );

    const [setPlace] = useMutation(setPlaceGql);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "1",
                    color: "white",
                    fontSize: 60,
                    width: "100%",
                    height: "90%",
                }}
            >
                <p
                    style={{
                        fontFamily: "LetterGothicMTStd",
                        fontSize: 32,
                    }}
                >
                    What's your Fellow?
                </p>
                <Formik
                    initialValues={{
                        place: "space",
                    }}
                    onSubmit={(value, helper) => {
                        setPlace({
                            variables: {
                                place: value.place,
                            },
                            onCompleted: () => {
                                helper.setSubmitting(false);
                            },
                        });
                    }}
                >
                    {({ submitForm, isSubmitting }) => (
                        <Form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <ImageList
                                sx={{
                                    width: 240,
                                    height: 240,
                                    border: "1px solid black",
                                    overflow: "hidden",
                                }}
                                cols={1}
                            >
                                {thumb &&
                                    thumb.map((item: string, i: number) => {
                                        console.log("item", item);
                                        return (
                                            <ImageListItem key={item}>
                                                <img
                                                    src={`${baseURL}/${item}`}
                                                    width={240}
                                                    height={240}
                                                />
                                            </ImageListItem>
                                        );
                                    })}
                            </ImageList>
                            <UiFileInputButton
                                label="Upload Files"
                                // allowMultipleFiles 가 false 일경우, 하나씩만 올릴 수 있다.
                                allowMultipleFiles={false}
                                uploadFileName="files"
                                onChange={onChange}
                                thumb={thumb}
                            />
                            <Field
                                component={RadioGroup}
                                name="place"
                                style={{
                                    marginLeft: "10px",
                                    flexDirection: "row",
                                }}
                            >
                                <FormControlLabel
                                    label="space"
                                    value="space"
                                    control={<Radio disabled={isSubmitting} />}
                                    disabled={isSubmitting}
                                />
                                <FormControlLabel
                                    label="ether"
                                    value="ether"
                                    control={<Radio disabled={isSubmitting} />}
                                    disabled={isSubmitting}
                                />
                                <FormControlLabel
                                    label="sea"
                                    value="sea"
                                    control={<Radio disabled={isSubmitting} />}
                                    disabled={isSubmitting}
                                />
                            </Field>
                            {isSubmitting ? (
                                <CircularProgress />
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={submitForm}
                                >
                                    저장
                                </Button>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export { Shape };
