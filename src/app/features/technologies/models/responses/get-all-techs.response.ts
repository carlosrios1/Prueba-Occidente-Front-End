import { Response } from "@core/models/api/response.model"
import { PaginatedData } from "@core/models/api/pagination.model"
import { TechSummaryDto } from "../dtos/tech-environment.dto";

export type GetAllTechsResponse = Response<PaginatedData<TechSummaryDto>>;