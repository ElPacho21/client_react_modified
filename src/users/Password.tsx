import React, { useState } from "react";
import "../styles.css";
import { DefaultProps } from "../system/utils/Tools";
import { changePassword } from "./UserApi";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import FormTitle from "../system/components/FormTitle";
import Form from "../system/components/Form";
import FormPassword from "../system/components/FormPassword";
import DangerLabel from "../system/components/DangerLabel";
import FormButtonBar from "../system/components/FormButtonBar";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import { useNavigate } from "react-router-dom";

export default function Password(props: DefaultProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")

    const errorHandler = useErrorHandler()
    const navigate = useNavigate();

    const updatePasswordClick = async () => {
        errorHandler.cleanRestValidations();

        if (!currentPassword) {
            errorHandler.addError("currentPassword", "No puede estar vacío");
        }
        if (!newPassword) {
            errorHandler.addError("newPassword", "No puede estar vacío");
        }
        if (newPassword !== newPassword2) {
            errorHandler.addError("newPassword2", "Las contraseñas no coinciden");
        }
        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            navigate("/");
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <FormTitle>Cambiar Password</FormTitle>

            <Form>
                <FormPassword
                    label="Password Actual"
                    name="currentPassword"
                    onChange={e => setCurrentPassword(e.target.value)}
                    errorHandler={errorHandler} />

                <FormPassword
                    label="Nuevo Password"
                    name="newPassword"
                    onChange={e => setNewPassword(e.target.value)}
                    errorHandler={errorHandler} />

                <FormPassword
                    label="Repetir Password"
                    name="newPassword2"
                    onChange={e => setNewPassword2(e.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Cambiar" onClick={updatePasswordClick} />
                    <FormButton label="Cancelar" onClick={() => navigate("/")} />
                </FormButtonBar>
            </Form>
        </div>
    );
}
