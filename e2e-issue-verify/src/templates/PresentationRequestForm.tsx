import { env } from "@/env.mjs";
import { type MattrConfig, mattrConfigSchema } from "@/types/common";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import QRCode from "react-qr-code";

/**
 * Step 1: Create PresentationRequest
 * Step 2: Render QR code + start countdown timer + start fetching PresentationRequest.response (long-polling)
 * Step 3 (VERY IMPORTANT): Stop all of step 2 once PresentationRequest.response is non-empty
 * Step 4: Display PresentationRequest.response, show reset button
 * Step 5: Revert UI back to prior to step 1
 */
const PresentationRequestForm: FC = () => {
  const { register, handleSubmit, getValues } = useForm<MattrConfig>({
    resolver: zodResolver(mattrConfigSchema),
  });

  const mutation =
    api.coreRoutes.createPresentationRequestQueryByExample.useMutation();

  const onSubmit: SubmitHandler<MattrConfig> = async (data) => {
    console.log(JSON.stringify(data));
    await mutation.mutateAsync(data);
  };

  return (
    <div>
      <h1>Generate Presentation Request</h1>
      <form
        className="TODO_LATER"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <div id="auth-token" className="mb-5">
          <label htmlFor="auth-token">Auth token</label>
          <input
            type="text"
            id="auth-token"
            {...register("token")}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
        <div id="tenant-domain" className="mb-5">
          <label htmlFor="tenant-domain">Tenant Domain</label>
          <input
            type="text"
            id="tenant-domain"
            {...register("tenantDomain")}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="bg-blue-500">
          {mutation.isLoading ? "Generating QR code..." : "Generate QR code"}
        </button>
      </form>
      {mutation.isSuccess && mutation.data.signedJws && (
        <div>
          <QRCode
            className="w-full content-center items-center"
            value={`didcomm://${env.NEXT_PUBLIC_APP_URL}/api/redirect/${
              mutation.data.id
            }?tenantDomain=${getValues("tenantDomain")}`}
          />
        </div>
      )}
      {mutation.isError && (
        <p>Failed to generate QR code! Error: {mutation.error.message}</p>
      )}
    </div>
  );
};

export default PresentationRequestForm;