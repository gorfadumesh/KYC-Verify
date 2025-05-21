import { useEffect, useRef, useState } from "react";
import UploadAadhaar from "./UploadAadhaar";
import UploadPan from "./UploadPan";
import UploadPhoto from "./UploadPhoto";
import UploadSignature from "./UploadSignature";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  surname: z.string().min(2, {
    message: "Surname must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  card_number: z.string().min(2, {
    message: "Card Number is required.",
  }),
  place_of_birth: z.string().min(2, {
    message: "Place of Birth must be at least 2 characters.",
  }),
  date_of_birth: z.string().min(2, {
    message: "Date of Birth is required.",
  }),
  sex: z.enum(["M", "F"]),
  height: z.string().min(2, {
    message: "Height is required.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality is required.",
  }),
  issue_date: z.string().min(2, {
    message: "Date of Issue is required.",
  }),
  expiry_date: z.string().min(2, {
    message: "Date of Expiry is required.",
  }),
  idFront: z.any(),
  idBack: z.any(),
});

export default function PersonalDetailsForm({
  onNextStep,
}: {
  onNextStep: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surname: "",
      name: "",
      card_number: "",
      place_of_birth: "",
      date_of_birth: "",
      sex: "M",
      height: "",
      nationality: "",
      issue_date: "",
      expiry_date: "",
      idFront: undefined,
      idBack: undefined,
    },
  });
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    // Convert images to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    try {
      const idFrontBase64 = values.idFront ? await fileToBase64(values.idFront) : "";
      const idBackBase64 = values.idBack ? await fileToBase64(values.idBack) : "";

      // Prepare payload as in the image
      const payload = {
        data: [
          idFrontBase64,
          idBackBase64,
          // Static values for the rest of the fields
          "static_surname",
          "static_name",
          "static_card_number",
          "static_place_of_birth",
          "static_date_of_birth",
          "static_sex",
          "static_height",
          "static_nationality",
          "static_issue_date",
          "static_expiry_date"
        ],
        event_data: null,
        fn_index: 6,
        session_hash: "orybe0zq5qx"
      };

      const response = await fetch("https://web.kby-ai.com/run/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log("API result:", result);
      // Store the API result for the next step/component
      localStorage.setItem("kyc-verification-data", JSON.stringify(result));
      onNextStep();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const handleSpeechRecognition = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      if (lastResult === "next") {
        onNextStep();
      }
    };

    if ("SpeechRecognition" in window) {
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.onresult = handleSpeechRecognition;
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onNextStep]);

  const startListening = () => {
    if (recognition.current) {
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  useEffect(() => {
    startListening();

    return () => {
      stopListening();
    };
  }, []);

  const speakMessage = (message: string) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-10 py-10 w-8/12">
        <h2 className="flex flex-col text-md font-semibold text-center border border-green-300 bg-green-300/10 hover:bg-green-300/20 hover:border-green-300 transition ease-in-out duration-500 hover:transition hover:ease-in-out hover:duration-500 rounded-lg p-3 w-max mx-auto">
          <span>
            {t("Fill your personal details and upload your documents.")}
          </span>
          <span>
            {t(
              "After completing the form, say next to proceed to the next step.",
            )}
          </span>
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mx-auto justify-center my-10"
            encType="multipart/form-data"
          >
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="w-[32%]">
                    <FormLabel>{t("Surname")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter your surname")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-[32%]">
                    <FormLabel>{t("Name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter your name")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem className="w-[32%]">
                    <FormLabel>{t("Card Number")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter card number")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="place_of_birth"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Place of Birth")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter place of birth")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Date of Birth")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Sex")}</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select sex")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">{t("Male")}</SelectItem>
                          <SelectItem value="F">{t("Female")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Height (cm)")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter height in cm")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Nationality")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter nationality")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Date of Issue")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("Date of Expiry")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full">
              <FormField
                control={form.control}
                name="idFront"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("ID Card Front Side")}</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idBack"
                render={({ field }) => (
                  <FormItem className="w-[49%]">
                    <FormLabel>{t("ID Card Back Side")}</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full bg-blue-600" type="submit" disabled={loading}>
              {loading ? t("Submitting, please wait...") : t("Next")}
            </Button>
           
          </form>
        </Form>

        {/* <div className="flex justify-between">
          <UploadAadhaar />
          <UploadPan />
        </div>
        <div className="flex justify-between">
          <UploadPhoto />
          <UploadSignature />
        </div>
        <div>
          <Button
            className="w-full bg-blue-600"
            onClick={() => {
              speakMessage(
                t("Verify if your Aadhaar details fetched are correct."),
              );
              onNextStep();
            }}
          >
            {t("Next")}
          </Button>
        </div> */}
      </div>
    </div>
  );
}

