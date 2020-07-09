import "./Pages.css";

import React, { useState, useEffect, useCallback } from "react";
import { Input, Typography, Button, Form, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Editor from "../Components/Editor/Editor";

const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
  const [inputTagField, setInputTagField] = useState("");
  const [isInputTagFieldVisible, setIsInputTagFieldVisible] = useState(false);
  const [tags, setTags] = useState([]);

  const validateDescription = useCallback(() => {
    for (let node of description) {
      for (let leaf of node.children) {
        if (leaf.text !== "") {
          setIsDescriptionEmpty(false);
          return true;
        }
      }
    }
    setIsDescriptionEmpty(true);
    return false;
  }, [description]);

  const removeTag = removedTag => {
    setTags(tags => tags.filter(tag => tag !== removedTag));
  };

  const addTag = () => {
    if (
      inputTagField.trim().length > 0 &&
      !tags.some(tag => tag === inputTagField.trim())
    ) {
      setTags(tags => [...tags, inputTagField.trim()]);
    }
    setInputTagField("");
    setIsInputTagFieldVisible(false);
  };

  useEffect(() => {
    if (isDescriptionEmpty) {
      validateDescription();
    }
  }, [isDescriptionEmpty, validateDescription]);

  const onSubmit = () => {
    if (!validateDescription()) return;
    console.log("SUBMIT");
  };

  return (
    <div className="ask-question">
      <div className="container">
        <Typography.Title level={1}>Ask a question</Typography.Title>
        <Form
          onFinish={onSubmit}
          onFinishFailed={() => {
            validateDescription();
          }}
        >
          <div className="input-group">
            <h3 level={4}>Question</h3>
            <small>Ask your question in specific words</small>
            <Form.Item
              name="question"
              rules={[{ required: true, message: "Question is missing." }]}
            >
              <Input
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="input-group">
            <h3 level={4}>Desription</h3>
            <small>
              Include all the information someone would need to answer your
              question
            </small>
            <Editor
              error={isDescriptionEmpty}
              value={description}
              setValue={setDescription}
            />
            {isDescriptionEmpty && (
              <div className="description-error">Description is missing.</div>
            )}
          </div>
          <div className="input-group">
            <h3 level={4}>Tags</h3>
            <small>
              Add up to 5 tags to describe what your question is about
            </small>
            <div
              style={{ margin: tags.length > 0 ? "5px 0" : "0" }}
              className="tags-div"
            >
              {tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  color="blue"
                  onClose={() => {
                    removeTag(tag);
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <Form.Item
              name="tags"
              rules={[
                {
                  validator() {
                    if (tags.length === 0) {
                      return Promise.reject("Tags are missing.");
                    } else if (tags.length > 5) {
                      return Promise.reject("You can enter upto 5 tags.");
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              {isInputTagFieldVisible && (
                <Input
                  style={{ width: 115 }}
                  autoFocus
                  autoComplete="off"
                  value={inputTagField}
                  onChange={e => setInputTagField(e.target.value)}
                  onPressEnter={() => addTag()}
                  onBlur={() => addTag()}
                />
              )}
              {!isInputTagFieldVisible && tags.length < 5 && (
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => setIsInputTagFieldVisible(true)}
                >
                  New Tag
                </Button>
              )}
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ask Question
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AskQuestion;
