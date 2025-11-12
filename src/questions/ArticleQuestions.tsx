import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DangerLabel from "../system/components/DangerLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import ImageButton from "../system/components/ImageButton";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { IStoredState } from "../system/store/SessionStore";
import { useSelector } from "react-redux";
import * as questionsApi from "./QuestionsApi";
import * as catalogApi from "../catalog/CatalogApi";
import { getUsers, IUser } from "../users/UserApi";

export default function ArticleQuestions() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const user = useSelector((s: IStoredState) => s.user);

  const [article, setArticle] = useState<catalogApi.IArticle | undefined>();
  const [items, setItems] = useState<questionsApi.IQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);

  const isAdmin = (user?.permissions || []).includes("admin");

  const reload = async () => {
    if (!articleId) return;
    try {
      const [qs, art] = await Promise.all([
        questionsApi.getByArticle(articleId),
        catalogApi.getArticle(articleId).catch(() => undefined as any),
      ]);
      setItems(qs);
      setArticle(art);
      try {
        const ids = new Set<string>();
        qs.forEach((q) => {
          if (q.userId) ids.add(q.userId);
          if (q.answeredBy) ids.add(q.answeredBy);
        });
        if (ids.size > 0) {
          const allUsers: IUser[] = await getUsers();
          const needed = Array.from(ids);
          const map: Record<string, string> = {};
          for (const u of allUsers) {
            if (needed.includes(u.id) || needed.includes(u.login)) {
              map[u.id] = u.name;
              map[u.login] = u.name;
            }
          }
          setUserNames(map);
        }
      } catch (_) {
      }
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  useEffect(() => {
    reload();
  }, [articleId]);

  const onCreate = async () => {
    if (!articleId) return;
    try {
      await questionsApi.create({ articleId, question: newQuestion });
      setNewQuestion("");
      await reload();
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await questionsApi.remove(id);
      await reload();
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  const startAnswer = (q: questionsApi.IQuestion) => {
    setAnsweringId(q._id);
    setAnswerText(q.answer || "");
  };

  const cancelAnswer = () => {
    setAnsweringId(null);
    setAnswerText("");
  };

  const saveAnswer = async (id: string) => {
    try {
      await questionsApi.answer(id, { answer: answerText });
      setAnsweringId(null);
      setAnswerText("");
      await reload();
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  const removeAnswer = async (id: string) => {
    try {
      await questionsApi.deleteAnswer(id);
      await reload();
    } catch (err: any) {
      errorHandler.processRestValidations(err);
    }
  };

  const canDelete = (q: questionsApi.IQuestion) => {
    return !!(isAdmin || (user && q.userId === user.id));
  };

  return (
    <div className="global_content">
      <FormTitle>
        Preguntas del artículo
        <div style={{ marginTop: 6 }}>
          <strong>{article?.name || articleId}</strong>
          <div style={{ color: "#666", fontSize: "0.5em" }}>{article?._id || articleId}</div>
        </div>
      </FormTitle>

      <Form>
        <FormInput
          label="Nueva pregunta"
          name="question"
          onChange={(e) => setNewQuestion(e.target.value)}
          value={newQuestion}
          errorHandler={errorHandler}
        />
        <DangerLabel message={errorHandler.errorMessage} />
        <FormButtonBar>
          <FormAcceptButton label="Publicar" onClick={onCreate} />
          <FormButton label="Volver" onClick={() => navigate(-1)} />
        </FormButtonBar>
      </Form>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={showOnlyUnanswered}
            onChange={(e) => setShowOnlyUnanswered(e.target.checked)}
          />
          Solo sin respuesta
        </label>
      </div>

      <QuestionsList
        items={showOnlyUnanswered ? items.filter((q) => !q.answer) : items}
        isAdmin={isAdmin}
        canDelete={canDelete}
        onDelete={onDelete}
        onStartAnswer={startAnswer}
        onCancelAnswer={cancelAnswer}
        onSaveAnswer={saveAnswer}
        onRemoveAnswer={removeAnswer}
        answeringId={answeringId}
        answerText={answerText}
        setAnswerText={setAnswerText}
        userNames={userNames}
      />
    </div>
  );
}

interface QuestionsListProps {
  items: questionsApi.IQuestion[];
  isAdmin: boolean;
  canDelete: (q: questionsApi.IQuestion) => boolean;
  onDelete: (id: string) => void;
  onStartAnswer: (q: questionsApi.IQuestion) => void;
  onCancelAnswer: () => void;
  onSaveAnswer: (id: string) => void;
  onRemoveAnswer: (id: string) => void;
  answeringId: string | null;
  answerText: string;
  setAnswerText: (t: string) => void;
  userNames: Record<string, string>;
}

function QuestionsList(props: QuestionsListProps) {
  if (!props.items || props.items.length === 0) {
    return (
      <div>
        <br />
        No hay preguntas todavía.
      </div>
    );
  }

  return (
    <div>
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Respuesta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((q) => {
            const isEditing = props.answeringId === q._id;
            return (
              <tr key={q._id}>
                <td>
                  {q.question}
                  <div style={{ fontSize: "0.85em", color: "#444", marginTop: 4 }}>
                    por {props.userNames[q.userId] || q.userId}
                    <div style={{ color: "#777", fontSize: "0.8em" }}>{q.userId}</div>
                    <div style={{ color: "#777", fontSize: "0.8em" }}>{new Date(q.createdAt || "").toLocaleString()}</div>
                  </div>
                </td>
                <td>
                  {isEditing ? (
                    <input
                      className="form-control"
                      value={props.answerText}
                      onChange={(e) => props.setAnswerText(e.target.value)}
                      placeholder="Escribe la respuesta"
                    />
                  ) : q.answer ? (
                    <div>
                      {q.answer}
                      <div style={{ fontSize: "0.85em", color: "#444", marginTop: 4 }}>
                        respondida por {props.userNames[q.answeredBy || ""] || q.answeredBy || ""}
                        {q.answeredBy && (
                          <div style={{ color: "#777", fontSize: "0.8em" }}>{q.answeredBy}</div>
                        )}
                        {q.answeredAt && (
                          <div style={{ color: "#777", fontSize: "0.8em" }}>{new Date(q.answeredAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <i>Sin respuesta</i>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {props.canDelete(q) && (
                    <ImageButton title="Eliminar pregunta" imageUrl="/assets/delete.png" className={{ width: 20 }} onClick={() => props.onDelete(q._id)} />
                  )}
                  {props.isAdmin && !isEditing && q.answer && (
                    <ImageButton title="Editar respuesta" imageUrl="/assets/edit.png" onClick={() => props.onStartAnswer(q)} />
                  )}
                  {props.isAdmin && !isEditing && !q.answer && (
                    <ImageButton title="Responder" className={{ width: 20 }} imageUrl="/assets/responder.png" onClick={() => props.onStartAnswer(q)} />
                  )}
                  {props.isAdmin && isEditing && (
                    <>
                      <ImageButton title="Guardar respuesta" imageUrl="/assets/enable.png" onClick={() => props.onSaveAnswer(q._id)} />
                      <ImageButton title="Cancelar" imageUrl="/assets/disable.png" onClick={() => props.onCancelAnswer()} />
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}