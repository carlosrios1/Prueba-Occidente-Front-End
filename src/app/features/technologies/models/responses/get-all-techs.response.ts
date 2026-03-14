import { Response } from "@core/models/api/response.model"
import { Pagination } from "@core/models/api/pagination.model"
import { TechSummaryDto } from "../dtos/tech-environment.dto";

export type GetAllTechsResponse = Response<Pagination<TechSummaryDto[]>>;