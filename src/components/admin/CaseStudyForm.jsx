'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import { validateCaseStudyForm } from '@/lib/validation';

function createKeypoint() {
  return { title: '', subtitle: '', image: '' };
}

function createFeatureDetail() {
  return { name: '', description: '', image: '' };
}

function createFeatureGroup() {
  return { feature: '', details: [createFeatureDetail()] };
}

function safeJsonStringify(value) {
  return JSON.stringify(value || [], null, 2);
}

function normalizeRecord(record) {
  if (!record) {
    return {
      title: '',
      sub_title: '',
      category_url_name: '',
      short_url: '',
      seo_title: '',
      seo_description: '',
      keywords: '',
      categoryId: '',
      subCategoryId: '',
      situation: '',
      solution: '',
      product_description: '',
      colorCode: '',
      isTopProject: false,
      why_us_title: '',
      feature_title: '',
      keypoints: [createKeypoint()],
      features: [createFeatureGroup()],
      why_us_data_json: '[]',
      existingProductImages: [],
      image: '',
      logo: '',
      cover_image: '',
    };
  }

  return {
    title: record.title || '',
    sub_title: record.sub_title || '',
    category_url_name: record.category_url_name || '',
    short_url: record.short_url || '',
    seo_title: record.seo_title || '',
    seo_description: record.seo_description || '',
    keywords: record.keywords || '',
    categoryId: record.categoryId ? String(record.categoryId) : '',
    subCategoryId: record.subCategoryId ? String(record.subCategoryId) : '',
    situation: record.situation || '',
    solution: record.solution || '',
    product_description: record.product_description || '',
    colorCode: record.colorCode ? `#${String(record.colorCode).replace('#', '')}` : '',
    isTopProject: Boolean(record.isTopProject),
    why_us_title: record.why_us_title || '',
    feature_title: record.feature_title || '',
    keypoints: record.keypoints?.length ? record.keypoints : [createKeypoint()],
    features: record.features?.length ? record.features : [createFeatureGroup()],
    why_us_data_json: safeJsonStringify(record.why_us_data || []),
    existingProductImages: (record.product_image || []).map((item) =>
      typeof item === 'string' ? { url: item } : item
    ),
    image: record.image || '',
    logo: record.logo || '',
    cover_image: record.cover_image || '',
  };
}

export default function CaseStudyForm({
  initialRecord,
  categories,
  subcategories,
  isModal = false,
  onCancel,
  onSuccess,
  createLabel = 'Add Case Study',
}) {
  const router = useRouter();
  const [formState, setFormState] = useState(() => normalizeRecord(initialRecord));
  const [mainImageFile, setMainImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [keypointFiles, setKeypointFiles] = useState({});
  const [featureFiles, setFeatureFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mode = initialRecord ? 'edit' : 'create';
  const visibleSubcategories = subcategories.filter(
    (item) => !formState.categoryId || String(item.cat_id) === String(formState.categoryId)
  );

  function updateField(name, value) {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateKeypoint(index, key, value) {
    setFormState((current) => ({
      ...current,
      keypoints: current.keypoints.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateFeature(groupIndex, key, value) {
    setFormState((current) => ({
      ...current,
      features: current.features.map((item, itemIndex) =>
        itemIndex === groupIndex ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateFeatureDetail(groupIndex, detailIndex, key, value) {
    setFormState((current) => ({
      ...current,
      features: current.features.map((group, currentGroupIndex) => {
        if (currentGroupIndex !== groupIndex) {
          return group;
        }

        return {
          ...group,
          details: group.details.map((detail, currentDetailIndex) =>
            currentDetailIndex === detailIndex ? { ...detail, [key]: value } : detail
          ),
        };
      }),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    const validationMessage = validateCaseStudyForm(formState);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      let parsedWhyUsData = [];
      if (formState.why_us_data_json.trim()) {
        parsedWhyUsData = JSON.parse(formState.why_us_data_json);
      }

      const payload = {
        ...formState,
        colorCode: formState.colorCode,
        keypoints: formState.keypoints,
        features: formState.features,
        why_us_data: parsedWhyUsData,
        existingProductImages: formState.existingProductImages,
      };

      const requestFormData = new FormData();
      requestFormData.append('payload', JSON.stringify(payload));

      if (mainImageFile) requestFormData.append('image', mainImageFile);
      if (logoFile) requestFormData.append('logo', logoFile);
      if (coverImageFile) requestFormData.append('cover_image', coverImageFile);

      productImageFiles.forEach((file) => requestFormData.append('product_images', file));

      Object.entries(keypointFiles).forEach(([index, file]) => {
        if (file) requestFormData.append(`keypoint_image_${index}`, file);
      });

      Object.entries(featureFiles).forEach(([key, file]) => {
        if (file) requestFormData.append(`feature_image_${key}`, file);
      });

      const response = await fetch(
        mode === 'edit' ? `/api/admin/casestudy/${initialRecord.id}` : '/api/admin/casestudy',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          body: requestFormData,
        }
      );

      const responsePayload = await response.json();
      if (!response.ok) {
        setErrorMessage(responsePayload.message || 'Unable to save the case study.');
        return;
      }

      if (typeof onSuccess === 'function') {
        onSuccess(responsePayload.data);
      } else {
        router.push('/admin/case-studies');
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof SyntaxError
          ? 'Why us JSON must be valid JSON.'
          : 'Something went wrong while saving the case study.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderHeader() {
    if (isModal) {
      return null;
    }

    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Case Study
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {mode === 'edit' ? 'Edit Case Study' : createLabel}
          </h1>
        </div>

        <Link href="/admin/case-studies" className="text-sm font-medium text-blue-700 hover:text-blue-800">
          Back to list
        </Link>
      </div>
    );
  }

  function renderFooter() {
    const cancelAction = onCancel ? (
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700"
      >
        Cancel
      </button>
    ) : (
      <Link href="/admin/case-studies" className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700">
        Cancel
      </Link>
    );

    return (
      <>
        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <div className={`flex flex-wrap gap-3 ${isModal ? 'justify-end border-t border-slate-200 pt-4' : ''}`}>
          {cancelAction}
          <Button type="submit" className="rounded-xl px-8 py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Case Study' : createLabel}
          </Button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={isModal ? 'flex h-full min-h-0 flex-col' : 'grid gap-8'}>
      <div className={isModal ? 'min-h-0 flex-1 overflow-y-auto pr-1' : 'grid gap-8'}>
        <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {renderHeader()}

          <div className="grid gap-5 md:grid-cols-2">
            <InputField label="Title" required value={formState.title} onChange={(event) => updateField('title', event.target.value)} />
            <InputField label="Slug / Category URL Name" required value={formState.category_url_name} onChange={(event) => updateField('category_url_name', event.target.value)} />
            <InputField label="Subtitle" value={formState.sub_title} onChange={(event) => updateField('sub_title', event.target.value)} />
            <InputField label="Short URL" value={formState.short_url} onChange={(event) => updateField('short_url', event.target.value)} />
            <InputField label="SEO Title" value={formState.seo_title} onChange={(event) => updateField('seo_title', event.target.value)} />
            <InputField label="Keywords" value={formState.keywords} onChange={(event) => updateField('keywords', event.target.value)} />
            <InputField label="Accent Color" placeholder="#008dd2" value={formState.colorCode} onChange={(event) => updateField('colorCode', event.target.value)} />
            <InputField label="Feature Section Title" value={formState.feature_title} onChange={(event) => updateField('feature_title', event.target.value)} />
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Category</span>
              <select
                required
                value={formState.categoryId}
                onChange={(event) => {
                  updateField('categoryId', event.target.value);
                  updateField('subCategoryId', '');
                }}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Subcategory</span>
              <select
                value={formState.subCategoryId}
                onChange={(event) => updateField('subCategoryId', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">Select subcategory</option>
                {visibleSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">SEO Description</span>
              <textarea
                rows={4}
                value={formState.seo_description}
                onChange={(event) => updateField('seo_description', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Situation</span>
              <textarea
                rows={4}
                value={formState.situation}
                onChange={(event) => updateField('situation', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Solution</span>
              <textarea
                rows={4}
                value={formState.solution}
                onChange={(event) => updateField('solution', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Product Description</span>
              <textarea
                rows={5}
                value={formState.product_description}
                onChange={(event) => updateField('product_description', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formState.isTopProject}
                onChange={(event) => updateField('isTopProject', event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-800">Mark as top project</span>
            </label>
          </div>
        </Card>

        <Card className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Media</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Main Image</span>
              {formState.image ? <span className="text-xs text-gray-500">{formState.image}</span> : null}
              <input type="file" accept="image/*" onChange={(event) => setMainImageFile(event.target.files?.[0] || null)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Logo</span>
              {formState.logo ? <span className="text-xs text-gray-500">{formState.logo}</span> : null}
              <input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Cover Image</span>
              {formState.cover_image ? <span className="text-xs text-gray-500">{formState.cover_image}</span> : null}
              <input type="file" accept="image/*" onChange={(event) => setCoverImageFile(event.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-gray-800">Product Gallery Images</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {formState.existingProductImages.map((item, index) => (
                <div key={`${item.url}-${index}`} className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700">
                  <div>{item.url}</div>
                  <button
                    type="button"
                    className="mt-2 text-red-600"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        existingProductImages: current.existingProductImages.filter((_, currentIndex) => currentIndex !== index),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <input
              className="mt-4"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setProductImageFiles(Array.from(event.target.files || []))}
            />
          </div>
        </Card>

        <Card className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Key Highlights</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFormState((current) => ({
                  ...current,
                  keypoints: [...current.keypoints, createKeypoint()],
                }))
              }
            >
              Add Keypoint
            </Button>
          </div>

          <div className="mt-6 grid gap-6">
            {formState.keypoints.map((keypoint, index) => (
              <div key={`keypoint-${index}`} className="rounded-2xl border border-gray-200 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Title" value={keypoint.title} onChange={(event) => updateKeypoint(index, 'title', event.target.value)} />
                  <InputField label="Subtitle" value={keypoint.subtitle} onChange={(event) => updateKeypoint(index, 'subtitle', event.target.value)} />
                </div>
                {keypoint.image ? <p className="mt-3 text-xs text-gray-500">Current image: {keypoint.image}</p> : null}
                <input
                  className="mt-3"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setKeypointFiles((current) => ({
                      ...current,
                      [index]: event.target.files?.[0] || null,
                    }))
                  }
                />
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-red-600"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      keypoints: current.keypoints.filter((_, currentIndex) => currentIndex !== index),
                    }))
                  }
                >
                  Remove keypoint
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Feature Groups</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFormState((current) => ({
                  ...current,
                  features: [...current.features, createFeatureGroup()],
                }))
              }
            >
              Add Feature Group
            </Button>
          </div>

          <div className="mt-6 grid gap-6">
            {formState.features.map((featureGroup, groupIndex) => (
              <div key={`feature-group-${groupIndex}`} className="rounded-2xl border border-gray-200 p-5">
                <InputField
                  label="Feature Group Name"
                  value={featureGroup.feature}
                  onChange={(event) => updateFeature(groupIndex, 'feature', event.target.value)}
                />

                <div className="mt-5 grid gap-4">
                  {featureGroup.details.map((detail, detailIndex) => (
                    <div key={`feature-detail-${groupIndex}-${detailIndex}`} className="rounded-2xl border border-dashed border-gray-300 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                          label="Detail Name"
                          value={detail.name}
                          onChange={(event) =>
                            updateFeatureDetail(groupIndex, detailIndex, 'name', event.target.value)
                          }
                        />
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-gray-800">Image</span>
                          {detail.image ? <span className="text-xs text-gray-500">{detail.image}</span> : null}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setFeatureFiles((current) => ({
                                ...current,
                                [`${groupIndex}_${detailIndex}`]: event.target.files?.[0] || null,
                              }))
                            }
                          />
                        </label>
                      </div>

                      <label className="mt-4 grid gap-2">
                        <span className="text-sm font-medium text-gray-800">Description</span>
                        <textarea
                          rows={4}
                          value={detail.description}
                          onChange={(event) =>
                            updateFeatureDetail(groupIndex, detailIndex, 'description', event.target.value)
                          }
                          className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500"
                        />
                      </label>

                      <button
                        type="button"
                        className="mt-4 text-sm font-medium text-red-600"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            features: current.features.map((group, currentGroupIndex) =>
                              currentGroupIndex === groupIndex
                                ? {
                                    ...group,
                                    details: group.details.filter((_, currentDetailIndex) => currentDetailIndex !== detailIndex),
                                  }
                                : group
                            ),
                          }))
                        }
                      >
                        Remove detail
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        features: current.features.map((group, currentGroupIndex) =>
                          currentGroupIndex === groupIndex
                            ? {
                                ...group,
                                details: [...group.details, createFeatureDetail()],
                              }
                            : group
                        ),
                      }))
                    }
                  >
                    Add Detail
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        features: current.features.filter((_, currentGroupIndex) => currentGroupIndex !== groupIndex),
                      }))
                    }
                  >
                    Remove Group
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Advanced JSON</h2>
          <div className="mt-5 grid gap-5">
            <InputField label="Why Us Title" value={formState.why_us_title} onChange={(event) => updateField('why_us_title', event.target.value)} />
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-800">Why Us Data JSON</span>
              <textarea
                rows={8}
                value={formState.why_us_data_json}
                onChange={(event) => updateField('why_us_data_json', event.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </label>
          </div>
        </Card>
      </div>

      <div className={isModal ? 'mt-6' : ''}>{renderFooter()}</div>
    </form>
  );
}
