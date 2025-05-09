# Canticum Bibliothecam

## Table of Contents

- [Canticum Bibliothecam](#canticum-bibliothecam)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Built With](#built-with)
  - [Features](#features)
  - [Contact](#contact)
  

## Overview

[![Project Overview](/public/img/Overview.jpg)](https://canticum-bibliothecam.vercel.app/)

_Live demo can be found [here](https://canticum-bibliothecam.vercel.app/)._

I made this project to satisfy the need for accessing a liturgical music library me and some friends of mine have with specific arrangements and notes on the music sheets on the go. Putting it on the web.

The application makes use of a Relational database hosted on [Turso](https://turso.tech/) to store the relationships between songs, authors and general info for both of these. It also interacts with the Google Drive API to store the actual files for the songs. Using Google Drive as bucket storage.


### Built With

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=000)](https://orm.drizzle.team/)

## Features

The user is greeted with a simple input in the Homepage where he can search for authors or songs:

![Homepage](/public/img/Home.gif)

On the sidepanel the user can navigate to other pages, namely an "Authors" page where he can search for authors:

![Authors](/public/img/Authors.gif)

And the same thing for the "Songs" page:

![Songs](/public/img/Songs.gif)

Clicking on any of the yellow cards for an "Author", leads the user to another page for that specific author. In this page he has some basic information about that author and a listing of all the songs where that author has some kind of contribution:

![Author Page](/public/img/Author_page.gif)

Similarly, clicking any "Song" card will lead the user to that song's page which has more detailed information for that song, a pdf viewer for the sheet music and some download links (for the pdf, musescore score file or audio file, if that song has them available):

![Song Page](/public/img/Song_page.gif)

The entire website is also available in 2 languages, English and Portuguese. The user can change the language for the entire website going to the button on the bottom of the sidepanel and selecting a language:

![Language](/public/img/Language.gif)

## Contact

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joao-m-branco/)

[My Portfolio Website](https://whitthenstein.vercel.app/)