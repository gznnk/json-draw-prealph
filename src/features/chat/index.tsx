import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { renderMarkdown } from "../markdown";
import { ChatUI } from "./ChatUI";
import type { Message } from "./types";

/**
 * Re-export ChatUI component with all related types
 */
export { ChatUI };
export type { ChatUIProps, Message } from "./types";
