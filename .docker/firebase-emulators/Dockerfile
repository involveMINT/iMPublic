FROM node:16-slim
ARG BUILD_DATE
ARG FIREBASE_TOOLS_VERSION
ARG HOME
LABEL org.label-schema.schema-version="1.0" \
      org.label-schema.name="firebase-tools" \
      org.label-schema.version=${FIREBASE_TOOLS_VERSION} \
      org.label-schema.build-date=${BUILD_DATE} \
      org.label-schema.description="Firebase CLI on the NodeJS image" \
      org.label-schema.url="https://github.com/firebase/firebase-tools/"
EXPOSE 4000
EXPOSE 5000
EXPOSE 5001
EXPOSE 8080
EXPOSE 8085
EXPOSE 9000
EXPOSE 9005
EXPOSE 9099
EXPOSE 9199
EXPOSE 4400
SHELL ["/bin/sh", "-c"]
RUN apt-get update && apt-get install -y default-jdk python3 && \
    npm install -g firebase-tools@${FIREBASE_TOOLS_VERSION} && \
    npm cache clean --force && \
    firebase setup:emulators:firestore && \
    firebase setup:emulators:storage && \
    firebase -V && \
    java -version 