# 💈 Barber Shop - Frontend

A responsive and dynamic scheduling interface for a barbershop, built with **Angular**. This app allows users to register, log in, and manage their appointments with ease.

## Tecnologias Utilizadas
![Angular](https://img.shields.io/badge/Angular-100%25-red)
![TypeScript](https://img.shields.io/badge/TypeScript-95%25-blue)
![HTML5](https://img.shields.io/badge/HTML5-70%25-lightgray)
![CSS3](https://img.shields.io/badge/CSS3-60%25-blue)
![Angular Material](https://img.shields.io/badge/Angular_Material-30%25-green)

## 📌 Features

- 🧾 **Authentication**: JWT-based login and registration
- 📅 **Scheduling System**: Choose a date, time, and barber for appointments
- 🧹 **Appointment Management**: View and delete scheduled appointments
- 🔄 **Reactive Forms**: With custom validations and error feedback
- 🧠 **Stateful Services**: Centralized logic and API communication

---

## 🛠 Technologies

- Angular 17+
- TypeScript
- Angular Material
- RxJS
- CSS Flexbox/Grid
- Angular Forms (ReactiveFormsModule)
- Angular Router
- HttpClientModule

---

## 🎨 UI Highlights

- ✅ ngIf, ngFor, ngSwitch
- 📦 Two-way Data Binding: `{{}}`, `[]`, `()`, and `ngModel`
- 🎯 Responsive layout with Angular Material and custom CSS
- 🧩 Component-based architecture for reusability

---

## 🔗 API Integration

Uses HttpClient to connect with the backend REST API. Ensure the backend is running and accessible.

```ts
this.http.post('/api/schedule', appointmentData)
```

---

## 🚀 Running Locally

```bash
npm install
ng serve
```

App will be available at: `http://localhost:4200`

---

## 🗂 Project Structure

```bash
src
├── app
│   ├── components
│   ├── pages
│   ├── services
│   ├── models
│   └── app-routing.module.ts
├── assets
└── environments
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
